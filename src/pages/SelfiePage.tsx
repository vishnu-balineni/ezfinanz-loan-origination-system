import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RefreshCcw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Stepper } from '../components/Stepper';
import './SelfiePage.css';

const SelfiePage = () => {
    const navigate = useNavigate();

    // References for DOM elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Operational States
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    // Start Video Stream
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setHasPermission(true);
        } catch (err) {
            console.error("Camera access denied or unavailable", err);
            setHasPermission(false);
        }
    };

    // Stop Video Stream
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Lifecycle: start/stop camera cleanly
    useEffect(() => {
        if (!capturedImage) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [capturedImage]);

    // Handle taking the photo
    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas exactly to video resolution
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw current frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get Base64 image
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageDataUrl);

                // Halt the active stream securely
                stopCamera();
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const submitApplication = () => {
        // Here you would normally POST the base64 string and other gathered app data to backend
        setIsSubmitted(true);
    };

    const returnToDashboard = () => {
        navigate('/dashboard');
    };

    // If completely submitted, overtake screen with Success State
    if (isSubmitted) {
        return (
            <div className="success-fullscreen animate-pop-in">
                <div className="success-icon-wrapper">
                    <CheckCircle2 size={64} color="white" />
                </div>
                <h2>Application Submitted for Admin Review</h2>
                <p>Your details and KYC documents have securely reached our team. You'll hear back within 24-48 hours via Email/SMS.</p>
                <button onClick={returnToDashboard} className="return-btn">
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="selfie-page-container">
            <div className="selfie-card">

                <div className="progress-header">
                    <Stepper currentStep={5} />
                    <h1 className="progress-title">Identity Verification</h1>
                </div>

                <div className="camera-container">
                    {/* Render Video or fallback to permission error or static captured image */}
                    {hasPermission === false && !capturedImage && (
                        <div className="camera-error">
                            <ShieldAlert size={48} />
                            <div className="camera-error-title">Camera Access Denied</div>
                            <div className="camera-error-detail">Please allow camera permissions in your browser settings to continue.</div>
                        </div>
                    )}

                    {hasPermission !== false && !capturedImage && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="video-feed"
                            />
                            {/* CSS / SVG Mask Overlay */}
                            <svg className="camera-svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <mask id="face-mask">
                                        <rect width="100" height="100" fill="white" />
                                        {/* A soft oval cut-out perfect for an aligned face shape */}
                                        <ellipse cx="50" cy="50" rx="35" ry="45" fill="black" />
                                    </mask>
                                </defs>
                                <rect width="100" height="100" fill="rgba(15, 23, 42, 0.85)" mask="url(#face-mask)" />
                            </svg>
                            <div className="overlay-instruction">Position your face inside the frame</div>
                        </>
                    )}

                    {capturedImage && (
                        <img src={capturedImage} alt="Captured Selfie" className="captured-image" />
                    )}

                    {/* Hidden canvas element utilized purely for buffer rendering */}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Controls */}
                {!capturedImage ? (
                    <button
                        onClick={takePhoto}
                        disabled={hasPermission === false}
                        className="action-btn"
                    >
                        <Camera size={20} />
                        Take Photo
                    </button>
                ) : (
                    <div className="button-group animate-pop-in">
                        <button onClick={submitApplication} className="action-btn">
                            <Sparkles size={20} />
                            Submit Application
                        </button>
                        <button onClick={retakePhoto} className="secondary-btn">
                            <RefreshCcw size={18} />
                            Retake Photo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelfiePage;
