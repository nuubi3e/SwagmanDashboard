'use client'
import { Log } from '@/lib/logs'
import { login } from '@/lib/actions/auth.action'
import { LoginPayload } from '@/lib/types/payload.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FormInput from '@/components/forms/FormInput'
import { error } from 'console'
import { LuLoader } from 'react-icons/lu'

interface LoginFormProps {
  redirectUrl: string
}

const LoginForm = ({ redirectUrl }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginPayload>()
  const [logging, setLogging] = useState(false)
  const router = useRouter()

  const formSubmitHandler = async (userCred: LoginPayload) => {
    setLogging(true)
    try {
      const res = await login(userCred)

      if (!res.ok) throw new Error(res.message)

      router.push(redirectUrl)
      Log.log(res)
    } catch (err: any) {
      toast.error(err.message)
      setFocus('username')
    } finally {
      setLogging(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(formSubmitHandler)}
      noValidate
      className='flex flex-col gap-4'>
      <FormInput
        register={register}
        required
        title='Username'
        placeholder='username'
        id='username'
        type='text'
        errors={errors}
      />
      <FormInput
        register={register}
        required
        title='Password'
        placeholder='XXXXX'
        id='password'
        type='password'
        errors={errors}
      />

      <button
        type='submit'
        disabled={logging}
        className='bg-lightPr py-3 mt-2 rounded-md transition-all text-darkPr font-semibold uppercase flex items-center justify-center disabled:cursor-not-allowed disabled:bg-opacity-85 focus:outline-lightPr focus:outline-offset-4 focus:outline-2'>
        {logging ? <LuLoader className='animate-spin text-2xl' /> : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
