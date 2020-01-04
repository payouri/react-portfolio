import React, { lazy, useState, memo, PureComponent } from 'react'
import styles from './Contact.css'
const Screen = lazy(() => import('@cmp/Screen/Screen'))
const TextArea = lazy(() => import('@cmp/Inputs/TextArea'))
const Input = lazy(() => import('@cmp/Inputs/Input'))
const SendButton = lazy(() => import('@cmp/Button/SendButton'))

class Contact extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            valid: false,
            formInputs: {
                email: '',
                name: '',
                message: '',
                hidden: 'fffaaa'
            }
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setFormInputs = this.setFormInputs.bind(this)
        this.setValid = this.setValid.bind(this)
    }

    setFormInputs(inputs) {
        this.setState(inputs)
    }
    setValid(bool) {
        this.setState({ valid: bool })
    }

    handleInput () {
        const { email, name, message } = formInputs
        this.setValid(email && name && message)
    }

    handleSubmit (e) {
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
    render() {
        const { handleSubmit, handleInput, setFormInputs } = this
        const { formInputs, valid } = this.state
        return (
            <Screen avoidNav={true}>
                <div className={styles['word-box']}>
                    <div className={styles['my-words']}>
                        Hello dear visitors, first of all thanks for visiting my creation.
                        Hope you find something interesting around here.
                        <br/>
                        The form down below has many purposes, so don&apos;t feel scared to hit me up with what&apos;s on your mind.
                        <br/>
                        I don&apos;t bite 😊
                    </div>
                </div>
                <form className={styles['form']} onInput={handleInput} onSubmit={handleSubmit}>
                    <Input label="The name you go by" required value={formInputs.name} onChange={e => { setFormInputs({ ...formInputs, name: e.target.value }) }} type="text"/>
                    <Input label="Your email address" required value={formInputs.email} onChange={e => { setFormInputs({ ...formInputs, email: e.target.value }) }} type="email"/>
                    <TextArea label="What you want to tell me" required value={formInputs.message} onChange={e => { setFormInputs({ ...formInputs, message: e.target.value }) }} />
                    <input title="do not fill or change" type="hidden" value={formInputs.hidden} onChange={e => { setFormInputs({ ...formInputs, hidden: e.target.value }) }} />
                    <SendButton disabled={!valid} type="submit">Envoyer</SendButton>
                </form>
            </Screen>
        )
    }
}

export default memo(Contact, (prevProps, nextProps) => {
    return prevProps.location.pathname === nextProps.location.pathname
})
