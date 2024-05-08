"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import Link from "next/link";

export default function Page() {
  const Url = ({ href, title = "" }) => (
    <Link href={href} className="underline text-blue-500 ml-1" target="_blank">
      {`${title ? title : href}`}
    </Link>
  );

  const expandedKeys = ["1", "2", "3"];
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
        <Accordion selectionMode="multiple" defaultExpandedKeys={expandedKeys}>
          {/* ------- CERTAINTY --------- */}
          <AccordionItem key="1" aria-label="Certainty" title="Certainty">
            <div className="text-gray-600 mb-3">
              <p>
                Certain can be interpreted as how confident the model was to
                predict this token
              </p>
              <br />
              <p>
                The certainty is calculated based on the logits. Logits are the
                raw scores output by the last layer of a neural network. They
                are used to calculate the probabilities of the output classes,
                before the normalization (Softmax). The certainty is calculated
                using the <code>compute_transition_scores</code>.
              </p>
              <br />
              <h4>Resources on Certainty</h4>
              <ul className="list-disc ml-5">
                <li>
                  More information on the <code>compute_transition_scores</code>{" "}
                  can be found
                  <Url
                    href={
                      "https://huggingface.co/docs/transformers/main/en/main_classes/text_generation#transformers.GenerationMixin.compute_transition_scores"
                    }
                    title="here"
                  ></Url>
                </li>
                <li>
                  You can find more information about the logits on
                  <Url
                    href="https://huggingface.co/docs/transformers/en/main_classes/output#transformers.modeling_outputs.CausalLMOutput"
                    title="huggingface"
                  ></Url>
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
                <span className="font-bold">Gradient x Input: </span>
                <span>
                  2 "Do they raise or lower the probablity of the next token?"
                </span>
              </p>
              <p>
                Feature Attribution techniques aim to explain model predictions
                by highlighting the most influential parts of the input data.
                For example, in a text-based model, this might involve
                identifying which words or phrases most strongly influence the
                {`model's`} output. This is done using a baseline (normally a
                zero vector).
              </p>
              <br />
              <h4>Resources on Feature Attribution</h4>
              <ul className="list-disc ml-5">
                <li>
                  "Learning Important Features Through Propagating Activation
                  Differences", Avanti Shrikumar 2019
                  <Url href={"https://arxiv.org/pdf/1704.02685"}></Url>
                </li>
                {/* Need to double check if this is true */}
                {/* <li>
                  Or if you want to dive deeper into it, find the original
                  publication
                  <Url
                    href={"https://dl.acm.org/doi/10.5555/3305890.3306024"}
                  ></Url>
                </li> */}
              </ul>
            </div>
          </AccordionItem>

          {/* ------- Contrastive Explanations --------- */}
          <AccordionItem
            key="3"
            aria-label="Contrastive Explanation"
            title=" Contrastive Explanation"
          >
            <div className="text-gray-600 mb-3">
              <p>
                Contrastive Explanation focuses on explaining why the model made
                a specific decision instead of another. It identifies what
                changes would need to be made to the input to alter the
                decision. This technique helps in understanding the
                decision-making process of a model by comparing the outcomes of
                slightly varied inputs.
              </p>
              <br />
              <h4>Resources on Contrastive Explanations</h4>
              <ul className="list-disc ml-5">
                <li>
                  Original paper;
                  <Link
                    className="underline text-blue-500"
                    href={"https://arxiv.org/pdf/2202.10419 "}
                  >
                    https://arxiv.org/pdf/2202.10419
                  </Link>
                </li>
              </ul>
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
            First, here is an overview of some surveys of XAI in LLMs.
            <li>
              H. Zhao et al., “Explainability for Large Language Models: A
              Survey,” Sep. 2023, Accessed: Oct. 26, 2023. Available:
              http://arxiv.org/abs/2309.01029
            </li>
            <li>
              M. Danilevsky, K. Qian, R. Aharonov, Y. Katsis, B. Kawas, and P.
              Sen, “A Survey of the State of Explainable AI for Natural Language
              Processing,” in Proceedings of the 1st Conference of the
              Asia-Pacific Chapter of the Association for Computational
              Linguistics
            </li>
            and the 10th International Joint Conference on Natural Language
            Processing, Suzhou, China: Association for Computational
            Linguistics, Dec. 2020, pp. 447–459. Accessed: Oct. 27, 2023.
            [Online]. Available: https://aclanthology.org/2020.aacl-main.46
            <li>
              H. Luo and L. Specia, “From Understanding to Utilization: A Survey
              on Explainability for Large Language Models,” Jan. 2024. Accessed:
              Jan. 29, 2024. [Online]. Available:
              https://www.semanticscholar.org/paper/
            </li>
            From-Understanding-to-Utilization%3A-A-Survey-on-for-Luo-Specia/3f877562995d1408b0b3abd5dfbbe8eeecb6061e?utm_source=alert_email&utm_content=LibraryFolder&utm_campaign=AlertEmails_WEEKLY&utm_term=LibraryFolder&email_index=1-2-4&utm_medium=28267295
            <li>
              Madsen, S. Reddy, and S. Chandar, “Post-hoc Interpretability for
              Neural NLP: A Survey,” ACM Comput. Surv., vol. 55, no. 8, p.
              155:1-155:42, Dec. 2022, doi: 10.1145/3546577.
            </li>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
