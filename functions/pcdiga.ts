import { AppService } from "src/app.service";

export function handler(event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: "ok"
    })
}