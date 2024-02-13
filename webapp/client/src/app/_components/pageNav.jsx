import BackButton from "./ui/backButton";
import NextButton from "./ui/nextButton";

const PageNav = () => {
  return (
    <div className="absolute left-2 top-12">
      <div className="p-2 flex gap-2">
        <BackButton></BackButton>
        {/* Not sure if the forward is needed */}
        {/* <NextButton></NextButton>  */}
      </div>
    </div>
  );
};

export default PageNav;
