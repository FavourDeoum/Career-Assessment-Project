function MultisessionAppSupport({ children }) {
    const { session } = useSession()
  
    return <React.Fragment key={session ? session.id : 'no-users'}>{children}</React.Fragment>
  }