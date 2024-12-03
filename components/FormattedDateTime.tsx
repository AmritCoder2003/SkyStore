import React from 'react'
 import {cn, formatDateTime } from '@/lib/utils'

const FormattedDateTime = ({ date , ClassName  }:{ date: string, ClassName?: string}) => {
  return (
    <p  className={cn('body-1 text-light-200', ClassName)} >
      {formatDateTime(date)}
    </p >
  )
}

export default FormattedDateTime
