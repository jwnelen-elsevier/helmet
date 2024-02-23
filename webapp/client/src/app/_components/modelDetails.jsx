const ModelCard = ({ model }) => {
  const isLoaded = model.isLoaded;

  if (!isLoaded) {
    return (
      <div className="card">
        <h5 className="p-2">No Model Loaded</h5>
      </div>
    );
  }

  const { model_checkpoint, tokenizer, model_type } = model.model;

  return (
    <div className="card">
      <div className="card-body">
        <h1>Model details:</h1>
        <h5 className="card-title">model checkpoint: {model_checkpoint}</h5>
        <h5 className="card-title">tokenizer checkpoint: {tokenizer}</h5>
        <h5 className="card-title">model type: {model_type}</h5>
      </div>
    </div>
  );
};

export default ModelCard;
