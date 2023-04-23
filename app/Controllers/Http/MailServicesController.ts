import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema,rules } from '@ioc:Adonis/Core/Validator'

export default class MailServicesController {
  public async sendMail ({request,response}:HttpContextContract){
    const emailSchema = schema.create({
      to: schema.string([
        rules.email(),
      ]),
      from: schema.string([
        rules.email(),
      ]),
      comment: schema.string(),
      first_name: schema.string(),
      last_name: schema.string(),
      price : schema.string (),
    })
    try{
      const payload = await request.validate({schema:emailSchema})
      if(payload){
        const html= `<h1 style="color:blue;">Order Bidding request</h1>
          <p>Hi, A designer is interested with your order. The designer has sent you the following information:</p>
          <p><h3> Price($)</h3><br/>${payload.price}</p>
          <p><h3> Desinger Comment</h3><br/>${payload.comment}</p>
          <bold>Connect with Designer for further information.</bold>
          <p>${payload.first_name} ${payload.last_name} <br/></p>
          <p>Contact Email: ${payload.from}</p>
          <p>To accept the order, please click the link below:</p>
          <p>https://acceptorder.com/accept-order</p>
          <p>Thank you</p>`
        try{
          await Mail.send((message) => {
            message
              .from('sudips4646@gmail.com')
              .to(payload.to)
              .subject('Order Bidding Request')
              .html(html)
          }
          )
          response.json({
            message: 'Mail sent successfully',
            success: true,
          })
        } catch(e){
          console.log(e)
          response.json({
            message: 'The mail address does not exist of the receiver, contact via Phone',
            success: false,
          })
        }
      } else{
        response.json({
          message: 'Mailing failed',
          success: false,
        })
      }
    } catch(e){
      response.json({
        message: 'The Sender or Receiver Mail is not valid',
        success: false,
      })
    }
  }
}
