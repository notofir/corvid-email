import { ok, serverError } from 'wix-http-functions';
import * as url from 'url';
import * as sgMail from '@sendgrid/mail';
// Your API key here.
sgMail.default.setApiKey();

// https://www.mysite.com/_functions/sendGrid/
export function post_sendGrid(request) {
    let options = {
        "headers": {
            "Content-Type": "application/json"
        }
    };
    return request.body.text()
        .then((body) => {
            let urlParams = url.parse("?" + body, true);
            let content = `${urlParams.query.html}<br \>Sent with <a href="https://github.com/notofir/corvid-email">corvid-email</a>`;
            const msg = {
                to: urlParams.query.recipientEmail,
                from: "sender@example.com", // Verified sender by SendGrid.
                subject: `Hi ${urlParams.query.recipientName} from ${urlParams.query.senderName}`,
                html: content
            }
            return sgMail.default
                .send(msg)
                .then(() => {
                    return ok(options);
                })
        })
        .catch((error) => {
            options.body = {
                "error": error
            };
            return serverError(options);
        });
}

/* https://www.mysite.com/_functions/testPost/
export function post_testPost(request) {
    let options = {
        "headers": {
            "Content-Type": "application/json"
        }
    };
    return request.body.text()
        .then((body) => {
            let urlParams = url.parse("?" + body, true);
            options.body = { "query": urlParams.query };
            return ok(options);
        })
        .catch((error) => {
            options.body = {
                "error": error
            };
            return serverError(options);
        });
}
 */