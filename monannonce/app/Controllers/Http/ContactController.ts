import Mail from "@ioc:Adonis/Addons/Mail"


export default class ContactController {
    async contactAuthor({request, response}) {
        const payload = request.only(['to','from','source', 'messageBody'])
        try{
            await Mail.send((message) => {
                message
                .from('info@monannonce.com')
                .to(payload.to)
                .subject('MonAnnonce - Prise de contact')
                .htmlView('emails/contact_author', {
                    email: payload.from,
                    source: payload.source,
                    messageBody: payload.messageBody
                })
            });
            return response.status(200).json({
                status: 200,
                message: 'Success on sending email'
            })
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: 'Error on sending email'
            })
        }
    }
}