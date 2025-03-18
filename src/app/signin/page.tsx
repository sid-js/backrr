"use client"
import Image from 'next/image'
import styles from './styles.module.css'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button, Input } from '@progress/kendo-react-all'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
interface SigninFormInputs {
    email: string
    password: string
}


export default function SigninPage() {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)
    const { control, handleSubmit } = useForm<SigninFormInputs>()
    const onSubmit: SubmitHandler<SigninFormInputs> = async (data) => {
        setLoading(true)
        const response = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })
        if (!response.error) {
            setLoading(false)
            router.push('/')
        } else {
            setLoading(false)
            setError(response.error.message ?? response.error.statusText)
        }
    }
    return (
        <div className={styles.container}>

            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Image src="/backrr-logo.svg" width={150} height={50} alt="logo" />
                </div>
                <div className={styles.title}>
                    <h1>Sign in to your account</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} label='Email Address' style={{
                            width: '100%',
                        }} />}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => <Input {...field} label='Set a Password' type={'password'} style={{
                            width: '100%',
                        }} />}
                    />
                    <Button themeColor={'primary'} type="submit" style={{
                        width: '100%',
                    }}>Sign In</Button>
                </form>
            </div>
            <NotificationGroup
                style={{
                    right: 0,
                    bottom: 0,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap-reverse'
                }}
            >
                <Fade>
                    {error && (
                        <Notification type={{ style: 'error', icon: true }} closable={true}>
                            <span>{error}</span>
                        </Notification>
                    )}
                </Fade>
            </NotificationGroup>
        </div>
    )
}