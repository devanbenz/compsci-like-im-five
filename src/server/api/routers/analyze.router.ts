import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import {OpenAIApi, Configuration} from "openai";



export const analyzeRouter = createTRPCRouter({
    analyze: publicProcedure
        .input(z.object({ text: z.string(), key: z.string() }))
        .mutation(async (opts) => {
            const { input } = opts;

            const configuration = new Configuration({
                apiKey: input.key,
            });

            const openai = new OpenAIApi(configuration);

            const responseText = await openai.createCompletion({
                   model: "text-davinci-003",
                   prompt: input.text,
                   temperature: 0.6,
                    max_tokens: 1000
               }).then((data) => {
                   if (data.data.choices[0]){
                       return data.data.choices[0].text
                   }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            }).catch((e)=> e.request as string)

            return responseText as string;
        })
});
