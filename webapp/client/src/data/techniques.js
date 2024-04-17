const techniques = [
  {
    id: "integratedgradients",
    name: "Integrated Gradients",
    description: "This is a description of the Integrated Gradients technique.",
    fullDescription: `
        Integrated Gradients is a technique that attributes the prediction of a new token
        with respect to the input. This is computatinoally expensive, but it is a good
        way to understand the model's decision. 
        `,
  },
  {
    id: "attribution-estimate",
    name: "Attribution Estimate",
    description: "This is a description of the Integrated Gradients technique.",
    fullDescription: `
        Estimate of the ground truth of the token attribution.
        `,
  },
  {
    id: "log-probs",
    name: "Log Probs",
    description: "Log Probablities of the alternatives to the token.",
    fullDescription: `
        For each token, it will give you a list of alternatives it could have produced.
        It will additionally give the probablity of each of those alternatives.
        `,
  },
  {
    id: "saliency",
    name: "Saliency",
    description: "This is a description of the Saliency technique.",
    fullDescription: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        convallis, urna ut mattis ullamcorper, purus nunc imperdiet sapien, at
        venenatis tellus eros vitae ligula. Aenean ut nibh non ligula convallis
        porttitor in vitae lacus. Nunc bibendum tellus nec malesuada auctor.
        Curabitur pulvinar euismod erat tristique pulvinar. Quisque eget erat
        finibus, iaculis nibh sodales, posuere justo. Curabitur pretium iaculis
        feugiat. Sed pretium facilisis justo, sed tempus nisl laoreet vel. Duis
        turpis nisl, rutrum vitae mi quis, pellentesque eleifend sapien. Aliquam
        ac nisl in sem dictum faucibus non in tortor. Sed vitae nisi viverra,
        venenatis ante vitae, euismod justo. Nam vel est quis massa consectetur
        pulvinar. Morbi sollicitudin facilisis dolor ut scelerisque. Cras
        blandit et arcu vitae iaculis. Proin egestas auctor velit, sit amet
        pellentesque urna. Donec sagittis consectetur mi. Donec elementum lectus
        ipsum, sit amet vehicula velit malesuada vitae. Mauris ut justo
        efficitur, facilisis velit sit amet, gravida dui. Sed condimentum, nulla
        ac faucibus scelerisque, massa ante euismod libero, vitae ultricies
        ligula ligula sed ligula. Ut commodo lorem at ante scelerisque, vitae
        congue velit pretium. Duis vel pellentesque massa. Proin rutrum
        convallis felis eu vulputate. Duis ante arcu, facilisis sit amet augue
        sit amet, bibendum condimentum erat.Aenean quis nulla non.
        `,
  },
  {
    id: "gradientxinput",
    name: "Gradient x Input",
    description: "This is a description of the Gradient x Input technique.",
    fullDescription: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        convallis, urna ut mattis ullamcorper, purus nunc imperdiet sapien, at
        venenatis tellus eros vitae ligula. Aenean ut nibh non ligula convallis
        porttitor in vitae lacus. Nunc bibendum tellus nec malesuada auctor.
        Curabitur pulvinar euismod erat tristique pulvinar. Quisque eget erat
        finibus, iaculis nibh sodales, posuere justo. Curabitur pretium iaculis
        feugiat. Sed pretium facilisis justo, sed tempus nisl laoreet vel. Duis
        turpis nisl, rutrum vitae mi quis, pellentesque eleifend sapien. Aliquam
        ac nisl in sem dictum faucibus non in tortor. Sed vitae nisi viverra,
        venenatis ante vitae, euismod justo. Nam vel est quis massa consectetur
        pulvinar. Morbi sollicitudin facilisis dolor ut scelerisque. Cras
        blandit et arcu vitae iaculis. Proin egestas auctor velit, sit amet
        pellentesque urna. Donec sagittis consectetur mi. Donec elementum lectus
        ipsum, sit amet vehicula velit malesuada vitae. Mauris ut justo
        efficitur, facilisis velit sit amet, gravida dui. Sed condimentum, nulla
        ac faucibus scelerisque, massa ante euismod libero, vitae ultricies
        ligula ligula sed ligula. Ut commodo lorem at ante scelerisque, vitae
        congue velit pretium. Duis vel pellentesque massa. Proin rutrum
        convallis felis eu vulputate. Duis ante arcu, facilisis sit amet augue
        sit amet, bibendum condimentum erat.Aenean quis nulla non.
        `,
  },
];

export default techniques;
