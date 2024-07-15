const { useState, useEffect } = require('react');
const { loadModels, getFullFaceDescription, createMatcher } = require('../src/api/face');

const testImg = require('../img/teste (1).jpg');

const JSON_PROFILE = require('../descriptors/bnk48.json')


const ImageInput = ( props ) => {
   const [imageURL, setImageURL] = useState(testImg);
   const [fullDesc, setFullDesc ] = useState(null);
   const [ detections, setDetections ] = useState(null)
   const [ descriptors, setDescriptors ] = useState(null)
   const [ loading, setLoading ] = useState(false)
   const [ faceMatcher, setFaceMather ] = useState(null)
   const [ match, setMatch ] = useState(null)


   useEffect(() => {
    const initializeModelsAndProcessImage = async () => {
        await loadModels();
        const matcher = await createMatcher(JSON_PROFILE);
        setFaceMather(matcher)
        await handleImage(imageURL)
    };
    initializeModelsAndProcessImage();
   }, []);

    const handleImage = async (image) => {
        const fullDescription = await getFullFaceDescription(image);

        if (fullDescription) {
            console.log(fullDescription);
            setFullDesc(fullDescription);
            setDetections(fullDescription.map(fd => fd.detection));
            setDescriptors(fullDescription.map(fd => fd.descriptor))
            setLoading(false)


            if (descriptors && faceMatcher) {
                const match = await Promise.all(descriptors.map(descriptor => faceMatcher.findBestMatch(descriptor)));
                setMatch(match)
            }
        }

        setLoading(false)
    }

    const handleFileChange = async (e) => {
        resetState();
        const file = e.target.files[0];

        if (file) {
            const newImageURL = URL.createObjectURL(file);
            setImageURL(newImageURL);
            setLoading(true);
            await handleImage(newImageURL)
        }
    }

    const resetState = () => {
        setImageURL(testImg);
        setFullDesc(null);
        setDetections(null);
        setLoading(false);
        setDescriptors(null);
        setFaceMather(null);
        setMatch(null);
    }

    let drawBox = null;

    if (detections) {
        drawBox = detections.map((detection, i ) => {
            const { height: _H, width: _W, x: _X, y: _Y } = detection.box
            return (
                <div key={i}>
                    <div
                        style={{
                            position: 'absolute',
                            border: 'solid',
                            borderColor: 'blue',
                            height: _H,
                            width: _W,
                            transform: `translate(${_X}px,${_Y}px)`,
                        }} 
                    >
                        {match && match[i] ? (
                            <p
                                style={{
                                backgroundColor: 'blue',
                                border: 'solid',
                                borderColor: 'blue',
                                width: _W,
                                marginTop: 0,
                                color: '#fff',
                                transform: `translate(-3px,${_H}px)`,
                                }}
                            >
                                {match[i].label}
                            </p>
                        ) : null}
                    </div>
                </div>
            );
        });
    }

    return(
        <div>
            <input 
                id='myFileUpload'
                type='file'
                onChange={handleFileChange}
                accept='.jpg, .jpeg, .png' 
            />
            <div style={{ position: 'realtive'}}>
               <div style={{ position: 'absolute' }}>
                    <img src={imageURL} alt='imageURL' />
               </div>
               {drawBox}
            </div>
        </div>
    )
}

export default ImageInput;

