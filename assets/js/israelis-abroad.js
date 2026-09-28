(function(){
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let helpRows=[], warningRows=[];

  function client(){
    if (window.antibookingSupabase) return window.antibookingSupabase;
    if (window.supabaseClient) return window.supabaseClient;

    /* supabase-client.js declares:
       const antibookingSupabase = ...
       A top-level const is not attached to window, but it is still available
       to subsequent classic scripts through the global lexical environment.
    */
    try {
      if (typeof antibookingSupabase !== "undefined" && antibookingSupabase) {
        return antibookingSupabase;
      }
    } catch(e) {}

    return null;
  }

  function warningLabel(level){
    return ({
      1:"רמה 1 — אמצעי זהירות בסיסיים",
      2:"רמה 2 — אמצעי זהירות מוגברים",
      3:"רמה 3 — מומלץ להימנע מנסיעות שאינן חיוניות",
      4:"רמה 4 — אזהרה חמורה / יש לעזוב בהתאם להנחיות"
    })[Number(level)]||"אין רמת אזהרה זמינה";
  }

  async function load(){
    const c=client();

    if(!c){
      console.error("Jooking Abroad: Supabase client not available.");
      $('countrySelect').innerHTML='<option value="">לא ניתן לטעון מדינות</option>';
      $('helpContent').innerHTML='<div class="help-card help-empty">לא ניתן להתחבר למאגר כרגע.</div>';
      return;
    }

    $('countrySelect').innerHTML='<option value="">טוען מדינות…</option>';

    const [{data:h,error:he},{data:w,error:we}]=await Promise.all([
      c.from('country_help').select('*').eq('active',true).order('country_en'),
      c.from('travel_warnings').select('*').order('country_he')
    ]);

    if(he){
      console.error("Jooking Abroad: country_help error",he);
      $('countrySelect').innerHTML='<option value="">שגיאה בטעינת המדינות</option>';
      $('helpContent').innerHTML='<div class="help-card help-empty">לא ניתן לטעון את רשימת המדינות כרגע.</div>';
      return;
    }

    if(we) console.warn("Jooking Abroad: travel_warnings error",we);

    helpRows=h||[];
    warningRows=w||[];

    const sel=$('countrySelect');

    if(!helpRows.length){
      sel.innerHTML='<option value="">אין מדינות זמינות</option>';
      $('helpContent').innerHTML='<div class="help-card help-empty">אין כרגע מדינות פעילות במאגר country_help.</div>';
      return;
    }

    sel.innerHTML=
      '<option value="">בחרו מדינה</option>'+
      helpRows.map(r=>`<option value="${esc(r.country_en)}">${esc(r.flag_emoji||'')} ${esc(r.country_he||r.country_en)}</option>`).join('');

    const qs=new URLSearchParams(location.search).get('country');

    if(qs && helpRows.some(r=>r.country_en===qs)){
      sel.value=qs;
      render(qs);
    }else{
      sel.value=helpRows[0].country_en;
      render(helpRows[0].country_en);
    }
  }

  function render(country){
    const h=helpRows.find(r=>r.country_en===country);
    if(!h) return;

    const w=warningRows.find(x=>x.country_he===h.country_he)||null;

    $('helpContent').innerHTML=`
      <div class="help-grid">
        <section class="help-card help-warning level-${w?.level||0}">
          <h2>אזהרת מסע רשמית</h2>
          <div class="warning-level">${esc(warningLabel(w?.level))}</div>
          <p>${esc(w?.recommendation_he||'לא נמצאה כרגע אזהרת מל״ל למדינה זו במאגר המסונכרן.')}</p>
          <div class="help-actions">
            <a class="primary" href="${esc(w?.details_url||'https://www.gov.il/he/departments/dynamiccollectors/travel-warnings-nsc?skip=0')}" target="_blank" rel="noopener">הנחיות רשמיות</a>
          </div>
          <div class="source-note">מקור: המטה לביטחון לאומי / data.gov.il · סנכרון אחרון: ${esc(w?.synced_at?new Date(w.synced_at).toLocaleString('he-IL'):'לא זמין')}</div>
        </section>

        <section class="help-card">
          <h2>${esc(h.flag_emoji||'')} ${esc(h.embassy_name_he||('נציגות ישראל — '+(h.country_he||h.country_en)))}</h2>

          <dl class="help-kv">
            <dt>עיר</dt><dd>${esc(h.city||'—')}</dd>
            <dt>כתובת</dt><dd>${esc(h.address||'—')}</dd>
            <dt>טלפון</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.phone||'—')}</span></dd>
            <dt>חירום</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.emergency_phone||'—')}</span></dd>
            <dt>קונסולרי</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.consular_phone||'—')}</span></dd>
            <dt>חירום מקומי</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.local_emergency_number||'—')}</span></dd>
          </dl>

          <div class="help-actions">
            ${h.emergency_phone?`<a class="danger phone-ltr" dir="ltr" href="tel:${esc(h.emergency_phone.replace(/[^+\d]/g,''))}">התקשרו למספר חירום</a>`:''}
            ${h.phone?`<a class="phone-ltr" dir="ltr" href="tel:${esc(h.phone.replace(/[^+\d]/g,''))}">טלפון הנציגות</a>`:''}
            ${h.website_url?`<a class="primary" href="${esc(h.website_url)}" target="_blank" rel="noopener">אתר רשמי</a>`:''}
            ${h.maps_url?`<a href="${esc(h.maps_url)}" target="_blank" rel="noopener">ניווט</a>`:''}
          </div>

          <div class="source-note">עודכן/אומת: ${esc(h.last_verified_at?new Date(h.last_verified_at).toLocaleDateString('he-IL'):'טרם אומת')}</div>
        </section>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded',()=>{
    $('countrySelect')?.addEventListener('change',e=>render(e.target.value));
    $('countryGo')?.addEventListener('click',()=>render($('countrySelect').value));
    load();
  });
})();
