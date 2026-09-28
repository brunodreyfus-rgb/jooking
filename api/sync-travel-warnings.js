const RESOURCE_ID = '2a01d234-b2b0-4d46-baa0-cec05c401e7d';
const DATA_URL = `https://data.gov.il/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&limit=1000`;

function extractHref(html='') {
  const m = String(html).match(/href=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function extractLevel(text='') {
  const s=String(text);
  const patterns=[/רמת[^()]{0,80}\(([1-4])\)/,/רמה[^()]{0,80}\(([1-4])\)/,/Level\s*([1-4])/i];
  for(const re of patterns){const m=s.match(re);if(m)return Number(m[1]);}
  return null;
}
module.exports = async function handler(req,res){
  if(process.env.CRON_SECRET){
    const auth=req.headers.authorization||'';
    if(auth!==`Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ok:false,error:'Unauthorized'});
  }
  const SUPABASE_PROJECT_URL=process.env.SUPABASE_PROJECT_URL;
  const SUPABASE_SERVICE_ROLE_KEY=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!SUPABASE_PROJECT_URL||!SUPABASE_SERVICE_ROLE_KEY) return res.status(500).json({ok:false,error:'Missing Supabase server env vars'});
  try{
    const r=await fetch(DATA_URL,{headers:{'user-agent':'Jooking/1.0 travel-warning sync'}});
    if(!r.ok) throw new Error(`data.gov.il ${r.status}`);
    const json=await r.json();
    const records=json?.result?.records||[];
    const nsc=records.filter(x=>String(x['משרד']||'').includes('מל"ל')||String(x['משרד']||'').includes('מל״ל')||String(x['logo']||'').includes('Flags_malal'));
    const payload=nsc.map(x=>({
      country_he:String(x.country||'').trim(),
      level:extractLevel(x.recommendations),
      recommendation_he:String(x.recommendations||'').trim()||null,
      details_url:extractHref(x.details),
      source_updated_at:String(x.date||'').trim()||null,
      synced_at:new Date().toISOString(),
      raw:x
    })).filter(x=>x.country_he);
    const up=await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/travel_warnings?on_conflict=country_he`,{
      method:'POST',
      headers:{'apikey':SUPABASE_SERVICE_ROLE_KEY,'Authorization':`Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify(payload)
    });
    if(!up.ok) throw new Error(`Supabase ${up.status}: ${await up.text()}`);
    return res.status(200).json({ok:true,synced:payload.length,source:DATA_URL});
  }catch(e){
    console.error(e);
    return res.status(500).json({ok:false,error:e.message});
  }
};
