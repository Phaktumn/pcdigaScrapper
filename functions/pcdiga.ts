import { AppService } from "src/app.service";
import { App } from "src/main";

export function handler(event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: (App.select(AppService) as unknown as AppService).getProduct(event.queryStringParameters.ean)
    })
}