import BackButton from "app/_components/ui/backButton";

const PageNav = () => {
  return (
    <div className="fixed left-4">
      <div className="p-2 flex gap-2">
        <BackButton></BackButton>
        {/* Not sure if the forward is needed */}
        {/* <NextButton></NextButton>  */}
      </div>
    </div>
  );
};

export default PageNav;
