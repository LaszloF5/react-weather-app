import React, {useState} from 'react'

export default function LocationForm({ updateCity }: { updateCity: (city: string) => void }) {
    const [city, setCity] = useState<string>('');
    const [temp, setTemp] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCity(temp);
        updateCity(temp)
        console.log('Current city: ', temp);
        setTemp('');
    }

    const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTemp(e.target.value);
    } 

  return (
    <form method='post' action={"#"} onSubmit={handleSubmit}>
        <label htmlFor="city-id">City: </label>
      <input type="text" 
      name="city" 
      id="city-id"
      placeholder='your city'
      value={temp} 
      required
      onChange={handleCity}/>
      <button type="submit">Submit</button>
    </form>
  )
}
