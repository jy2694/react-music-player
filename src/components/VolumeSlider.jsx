import { useEffect, useRef, useState } from 'react';
import '../css/VolumeSlider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeLow } from '@fortawesome/free-solid-svg-icons';
export default function VolumeSlider(props){

    const [value, setValue] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [step, setStep] = useState(1);
    const volumeSlider = useRef(null);

    useEffect(() => {
        if(props.min !== null && props.min !== undefined) {
            setMin(props.min);
            setValue(props.min);
        }
        if(props.max !== null && props.max !== undefined) {
            setMax(props.max);
        }
        if(props.step !== null && props.step !== undefined) setStep(props.step);
    }, []);

    useEffect(() => {
        if(props.onChange !== null && props.onChange !== undefined){
            props.onChange(value);
        }
    }, [value]);

    const onDragVolumeSlider = (e) => {
        if(e.buttons !== 1) return;
        if(volumeSlider === null) return;
        const clientX = e.clientX;
        const objectX = volumeSlider.current.getBoundingClientRect().left;
        const objectMax = volumeSlider.current.offsetWidth;
        console.log({
            clientX : clientX,
            objectX : objectX,
            objectMax : objectMax,
            offsetX : clientX-objectX
        });
        const dw = (max-min) / objectMax;
        const v = findNearCoordinate(min + ((clientX - objectX) * dw));
        
        setValue(v);
    }

    const findNearCoordinate = (v) =>{
        if(v >= max) return max;
        if(v <= min) return min;
        let nearValue = 0;
        let cost = max+1;
        for(let i = min; i <= max; i += step){
            const iCost = Math.abs(i-v);
            if(iCost < cost){
                cost = iCost;
                nearValue = i;
            } else if(iCost > cost){
                break;
            }
        }
        return nearValue;
    }

    return (
        <div className="volume-wrapper" {...props} onMouseMove={onDragVolumeSlider}>
            <FontAwesomeIcon style={{width: "5%", marginRight: "5%", fontSize: "large"}} icon={faVolumeLow}/>
            <div 
                ref={volumeSlider} 
                className="volume-bar">
                <div className="volume-bar-inner" style={{width: (((value-min)/(max-min)) * 100.0) + "%"}}>
                    <div className="volume-bar-thumb"></div>
                </div>
            </div>
            <FontAwesomeIcon style={{width: "5%", marginLeft: "5%", fontSize: "large"}} icon={faVolumeHigh}/>
        </div>
    );
}