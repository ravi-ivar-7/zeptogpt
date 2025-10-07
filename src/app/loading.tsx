import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'

export default function Loading() {
  return (
    <LoadingSpinner 
      fullScreen={true}
      text="Loading application..."
      animationType="particles"
      tips={[
        "Setting up your workspace...",
        "Loading your content...",
        "Almost ready!"
      ]}
    />
  )
}