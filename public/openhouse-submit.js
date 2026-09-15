// Also embedded in the supplied standalone forms so fallback survives a site outage.
export async function submitOpenHouse(formData) {
  try {
    const response = await fetch('https://www.harbisonstandard.com/hq/api/openhouse', {
      method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(formData),signal:AbortSignal.timeout(20000),
    });
    const result = await response.json();
    if (response.ok && result.success === true) return result;
  } catch { /* A timeout, network error or HTML response must use the backup. */ }
  const backup = await fetch('https://formspree.io/f/xqpkdwrp', {
    method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({...formData,_subject:'Open House Registration',_replyto:formData.email}),
    signal:AbortSignal.timeout(15000),
  });
  if (!backup.ok) throw new Error('Registration was not received. Please retry.');
  return {success:true,delivery:'formspree'};
}
