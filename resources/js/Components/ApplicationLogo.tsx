import { Link } from '@inertiajs/react'

type ApplicationLogoProps = {
  className?: string
}

export default function ApplicationLogo({ className = '' }: ApplicationLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Link href="/">
        <img src="/img/app-logo-black-update.png" alt="DOST-STII logo" className="h-12 w-auto" />
      </Link>
    </div>
  )
}
