import { Check } from 'lucide-react';
import './Stepper.css';

interface StepperProps {
    currentStep: number;
    steps?: string[];
}

const defaultSteps = ["Verify", "KYC", "Offers", "Bank", "Selfie"];

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps = defaultSteps }) => {

    // Calculates percentage width ensuring it spreads perfectly across our absolute lines
    const progressWidth = `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`;

    return (
        <div className="stepper-wrapper">
            <div className="stepper-line-bg" />
            <div
                className="stepper-line-progress"
                style={{ width: progressWidth }}
            />

            {steps.map((label, index) => {
                const stepNum = index + 1;

                let stepStateClass = 'step-pending';
                if (stepNum < currentStep) stepStateClass = 'step-completed';
                if (stepNum === currentStep) stepStateClass = 'step-current';

                return (
                    <div key={label} className={`step-item ${stepStateClass}`}>
                        <div className="step-node">
                            {stepNum < currentStep ? (
                                <Check size={16} strokeWidth={3} />
                            ) : (
                                stepNum
                            )}
                        </div>
                        <span className="step-label">{label}</span>
                    </div>
                );
            })}
        </div>
    );
};
