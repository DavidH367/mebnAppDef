export const SingleComboBox = ({
    label,
    options,
    value,
    setValue,
    disabled,
})=> {
    const handleOptionChange = (e)=>{
        setValue(e.target.value)
    }
    return (
        <div className="dropdown-container" style={{marginTop:'24px'}}>
            <label className="field-titles"><b>{label}</b></label>
            <div className="comboBox-container">
                <select value={value} onChange={handleOptionChange} style={{marginTop:'5px'}} disabled={disabled}>
                    <option className="input-options">{value}</option>
                    {options && options.map((item, key)=>(
                        <option 
                        key={key} 
                        value={item}
                        className="input-options">{item}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
