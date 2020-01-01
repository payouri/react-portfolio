import React, { useState } from 'react'
import Input from '../Inputs/Input'
import TextArea from '../Inputs/TextArea'
import SendButton from '../Button/SendButton'
import styles from './Contact.css'
function Contact() {

    const [valid, setValid] = useState(false)

    const [formInputs, setFormInputs] = useState({
        email: '',
        name: '',
        message: '',
        hidden: 'fffaaa'
    })

    const handleInput = e => {
        const { email, name, message } = formInputs
        setValid(email && name && message)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const { hidden, ...rest } = formInputs
        if(hidden === 'fffaaa') {
            setFormInputs({
                email: '',
                name: '',
                message: '',
                hidden: 'fffaaa'
            })
            fetch('/', {
                method: 'POST',
                body: rest
            })
        }
    }

    return (
        <form className={styles['form']} onInput={handleInput} onSubmit={handleSubmit}>
            <Input required={true} value={formInputs.name} onChange={e => { setFormInputs({ ...formInputs, name: e.target.value }) }} type="text"/>
            <Input required={true} value={formInputs.email} onChange={e => { setFormInputs({ ...formInputs, email: e.target.value }) }} type="email"/>
            <TextArea required value={formInputs.message} onChange={e => { setFormInputs({ ...formInputs, message: e.target.value }) }} />
            <input title="do not fill or change" type="hidden" value={formInputs.hidden} onChange={e => { setFormInputs({ ...formInputs, hidden: e.target.value }) }} />
            <SendButton disabled={!valid} type="submit">Envoyer</SendButton>
        </form>
    )
}

export default Contact
