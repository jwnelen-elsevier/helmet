import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex justify-center align-middle items-center">
      <div className="text-left p-5 m-5 max-w-screen-md border">
        <h1 className="">Information</h1>
        <p>The techniques that are currenlty are implemented are:</p>
        <ol className="list-decimal ml-5">
          <li className="">(un)Certainty</li>
          <li className="">Feature Attribution</li>
          <li className="">Contrastive Explanation</li>
        </ol>
        <h3>Certainty</h3>
        <p>
          The certainty is calculated based on the logits. Logits are the raw
          scores output by the last layer of a neural network. They are used to
          calculate the probabilities of the output classes, before the
          normalization (Softmax).
          <br />
          The certainty is calculated using the{" "}
          <code>compute_transition_scores</code>.
        </p>
        <br />
        <h4>Resources on Certainty</h4>
        <ul className="list-disc ml-5">
          <li>
            More information on the <code>compute_transition_scores</code> can
            be found{" "}
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
        <h3>Feature Attribution</h3>
        <p>
          Feature Attribution techniques aim to explain model predictions by
          highlighting the most influential parts of the input data. For
          example, in a text-based model, this might involve identifying which
          words or phrases most strongly influence the model's output. In the
          current approach, Integrated Gradients are used.
        </p>
        <br />
        <h4>Resources on Feature Attribution</h4>
        <ul className="list-disc ml-5">
          <li>
            More information on the <code>compute_transition_scores</code> can
            be found{" "}
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
        <h3>Contrastive Explanation</h3>
        <p>
          Contrastive Explanation focuses on explaining why the model made a
          specific decision instead of another. It identifies what changes would
          need to be made to the input to alter the decision. This technique
          helps in understanding the decision-making process of a model by
          comparing the outcomes of slightly varied inputs.
        </p>
      </div>
    </div>
  );
}
