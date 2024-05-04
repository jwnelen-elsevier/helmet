"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex justify-center align-middle min-w-full items-center ">
      <div className="text-left p-8 m-8  max-w-screen-md flex-grow border shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Information</h1>
        <div className="text-gray-600 mb-3">
          <p>The techniques that are currenlty are implemented are:</p>
          <ol className="list-decimal ml-5">
            <li className="my-1">(un)Certainty</li>
            <li className="mb-1">Feature Attribution</li>
            <li className="mb-1">Contrastive Explanation</li>
          </ol>
        </div>
        <Accordion selectionMode="multiple">
          {/* ------- CERTAINTY --------- */}
          <AccordionItem key="1" aria-label="Certainty" title="Certainty">
            <div className="text-gray-600 mb-3">
              <p>
                The certainty is calculated based on the logits. Logits are the
                raw scores output by the last layer of a neural network. They
                are used to calculate the probabilities of the output classes,
                before the normalization (Softmax).
                <br />
                The certainty is calculated using the{" "}
                <code>compute_transition_scores</code>.
              </p>
              <br />
              <h4>Resources on Certainty</h4>
              <ul className="list-disc ml-5">
                <li>
                  More information on the <code>compute_transition_scores</code>{" "}
                  can be found{" "}
                  <Link
                    className="underline text-blue-500"
                    target="_blank"
                    href="https://huggingface.co/docs/transformers/main/en/main_classes/text_generation#transformers.GenerationMixin.compute_transition_scores"
                  >
                    here
                  </Link>
                </li>
                <li>
                  You can find more information about the logits on{" "}
                  <Link
                    className="underline text-blue-500"
                    target="_blank"
                    href="https://huggingface.co/docs/transformers/en/main_classes/output#transformers.modeling_outputs.CausalLMOutput"
                  >
                    Huggingface
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </AccordionItem>
          {/* ------- Feature Attribution --------- */}
          <AccordionItem
            key="2"
            aria-label="Feature Attribution"
            title="Feature Attribution"
          >
            <div className="text-gray-600 mb-3">
              <p>
                Feature Attribution techniques aim to explain model predictions
                by highlighting the most influential parts of the input data.
                For example, in a text-based model, this might involve
                identifying which words or phrases most strongly influence the
                {`model's`} output. In the current approach, Integrated
                Gradients are used. <br />
                This is done using a baseline (normally a zero vector) and then
              </p>
              <br />
              <h4>Resources on Feature Attribution</h4>
              <ul className="list-disc ml-5">
                <li>
                  Integrated Gradients article on{" "}
                  <Link
                    className="underline text-blue-500"
                    href={
                      "https://medium.com/@seth_12468/integrated-gradients-interpreting-the-llm-decision-making-process-821789001046"
                    }
                  >
                    Medium
                  </Link>
                </li>
                <li>
                  Or if you want to dive deeper into it, find the original
                  publication
                  <Link
                    className="underline text-blue-500"
                    href={"https://dl.acm.org/doi/10.5555/3305890.3306024"}
                  >
                    https://dl.acm.org/doi/10.5555/3305890.3306024
                  </Link>
                </li>
              </ul>
            </div>
          </AccordionItem>

          {/* ------- Contrastive Explanations --------- */}
          <AccordionItem
            key="3"
            aria-label="Contrastive Explanation"
            title=" Contrastive Explanation"
          >
            <div>
              <p className="text-gray-600 mb-3">
                Contrastive Explanation focuses on explaining why the model made
                a specific decision instead of another. It identifies what
                changes would need to be made to the input to alter the
                decision. This technique helps in understanding the
                decision-making process of a model by comparing the outcomes of
                slightly varied inputs.
              </p>
            </div>
          </AccordionItem>

          {/* ------- Surveys --------- */}
          <AccordionItem
            key="4"
            aria-label="Surveys"
            title="Additional surveys"
          >
            <p>
              Lastly, I would like to give an overview of some existing surveys
            </p>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
