import { fetchModel } from "@/api/status";

const ModelCard = async () => {
  const model = await fetchModel();
  console.log(model);
  const isLoaded = model.isLoaded;

  if (!isLoaded) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">No Model Loaded</h5>
        </div>
      </div>
    );
  }

  const { model_checkpoint, tokenizer_checkpoint, model_type } = model.model;

  return (
    <div className="card">
      <div className="card-body">
        <h1>Model detail:s</h1>
        <h5 className="card-title">model checkpoint: {model_checkpoint}</h5>
        <h5 className="card-title">
          tokenizer checkpoint: {tokenizer_checkpoint}
        </h5>
        <h5 className="card-title">model type: {model_type}</h5>
      </div>
    </div>
  );
};

export default ModelCard;
