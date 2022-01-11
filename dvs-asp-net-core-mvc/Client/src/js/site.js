import IDVC from "@idscan/idvc";
import "../../node_modules/@idscan/idvc/dist/css/idvc.css";


let idvc = new IDVC({
    el: 'videoCapturingEl',
    licenseKey: "LICENSE KEY",
    isShowManualSwitchButton: true,
    showSubmitBtn: true,
    isShowVersion: true,
    tapOnVideo: false,
    tapBackSide: false,
    minPDFframes: 1,
    parseMRZ: false,
    tapFace: false,
    enableLimitation: true,
    autoContinue: true,
    resizeUploadedImage: 1500,
    showForceCapturingBtn: false,
    fixFrontOrientAfterUpload: false,
    enableFlash: false,
    steps: [
        { type: 'front', name: 'Front Scan' },
        { type: 'face', name: 'Selfie' },
    ],
    useCDN: true,
    networkUrl: '/networks',
    showPreviewForOneStep: true,
    priority: 'auto',
    realFaceMode: 'all',
    types: ['ID'],
    strictAllowedTypes: false,
    enableGeolocation: false,
    displayParsedData: false,
    onChange(data) {
        console.log(data);
    },
    onCameraError(data) {
        console.log(data);
    },
    onReset(data) {
        console.log(data);
    },
    onRetakeHook(data) {
        console.log(data);
    },
    submit(data) {
        idvc.showSpinner(true);
        let frontImage;
        let backImage;
        let faceImage;
        let trackString;
        let verifyFace = true;

        switch (data.documentType) {
            // Drivers License and Identification Card
            case 1:
                frontImage = data.steps
                    .find((item) => item.type === "front")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];

                let backStep = data.steps.find((item) => item.type === "back");
                trackString =
                    backStep && backStep.trackString ? backStep.trackString : "";
                backImage = backStep.img.split(/:image\/(jpeg|png);base64,/)[2];

                faceImage = data.steps
                    .find((item) => item.type === "face")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];

                verifyFace = false;

                break;
            // US and International Passports
            case 2:
                let mrzStep = data.steps.find((item) => item.type === "mrz");
                trackString = mrzStep && mrzStep.mrzText ? mrzStep.mrzText : "";
                frontmage = mrzStep.img.split(/:image\/(jpeg|png);base64,/)[2];

                faceImage = data.steps
                    .find((item) => item.type === "face")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];

                break;
            // US Passport Cards
            case 3:
            // US Green Cards
            case 6:
            // International IDs with 3 line MRZs
            case 7:
                frontImage = data.steps
                    .find((item) => item.type === "front")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];

                backImage = data.steps
                    .find((item) => item.type === "mrz")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];

                faceImage = data.steps
                    .find((item) => item.type === "face")
                    .img.split(/:image\/(jpeg|png);base64,/)[2];
                break;
            default:
        }

        let request = {
            frontImageBase64: frontImage,
            backOrSecondImageBase64: backImage,
            faceImageBase64: faceImage,
            documentType: data.documentType,
            trackString: trackString,
            userAgent: window.navigator.userAgent,
            captureMethod: data.captureMethod,
            verifyFace: verifyFace,
        };

        fetch("BACKEND URL", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(request),
        })
        .then((response) => response.json())
        .then((data) => {
            idvc.showSpinner(false);
            document.getElementById("result-data").innerText = JSON.stringify(data);
        })
        .catch((err) => {
            idvc.showSpinner(false);
            console.log(err);
        });
},
});

