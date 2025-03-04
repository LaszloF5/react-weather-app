import React, {useState} from 'react'
import "../Styles/LocationForm.css";
import { on } from 'events';

interface LocationFormProps {
  updateCity: (city: string) => void;
  setToggleLocationForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LocationForm({ updateCity, setToggleLocationForm }: LocationFormProps) {
    const [city, setCity] = useState<string>('');
    const [temp, setTemp] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCity(temp);
        updateCity(temp)
        console.log('Current city: ', temp);
        setTemp('');
        setToggleLocationForm(true);
    }

    const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTemp(e.target.value);
    } 

  return (
    <form className='locationForm' method='post' action={"#"} onSubmit={handleSubmit}>
        <label className='locationForm_label' htmlFor="city-id">Choose a location:
      </label>
      <input className='locationForm_input' type="text" 
      name="city" 
      id="city-id"
      placeholder='your city'
      value={temp} 
      required
      autoFocus
      onChange={handleCity}/>
      <button className='locationForm_button' type="submit">Search</button>
    </form>
  )
}
