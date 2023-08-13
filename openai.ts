import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION!,
    apiKey: process.env.OPENAI_API_KEY!,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

export default openai;