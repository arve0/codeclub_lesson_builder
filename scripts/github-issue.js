/**
 * adds issue body to github "report problem"-links
 * @param {*DOM element} elm - link to github
 */
export default function addGithubIssueBody (_, elm) {
  let body = `
Oppgave: ${window.location.href}

Beskriv ditt problem her. Ta gjerne med operativsystem, nettleser og eventuell kode du har skrevet.`
  elm.href += body.replace(/\n/g, '%0A')
}
