import { footer } from '../components/footer'
import { header } from '../components/header'
import { styles } from '../components/styles'

export function resetPasswordInstructionsEmail(
  name: string,
  resetUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Recuperação de senha</title>
        ${styles()}
      </head>
      <body>
        ${header('Bem vindo ao Easylove!')}
          <tr>
            <td>
              <p>Olá, ${name}!</p>
              <p>Você está recebendo esse email pois você ou outra pessoa solicitou a troca de senha da sua conta.</p>
              <p>Para trocar a sua senha. clique no link abaixo, ou se preferir, copie e cole em seu navegador</p>
              <a href="${resetUrl}" target="_blank">${resetUrl}</a>
              <p>Se precisar de alguma coisa, não hesite em entrar em contato.</p>
              <p>Atenciosamente,</p>
              <p><strong>Equipe Easylove</strong></p>
            </td>
          </tr>
        ${footer()}
      </body>
    </html>
  `
}
