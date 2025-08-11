import "./StepViewer.less";

const StepViewer = (props: {
  stepNumber: number;
  selectedStep: number;
  className?: string;
}) => {
  const { stepNumber, selectedStep, className } = props;

  const renderStep = () => {
    const steps = [];
    for (let i = 0; i < stepNumber; i++) {
      steps.push(
        <div
          className={`WeTooStepViewer__step  ${
            i < selectedStep && "WeTooStepViewer__step--active"
          }`}
          key={i}
        ></div>
      );
    }
    return steps;
  };

  return <div className={`WeTooStepViewer ${className}`}>{renderStep()}</div>;
};

export default StepViewer;
