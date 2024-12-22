import { FormEvent, useState } from "react"

interface ResourceFormProps {
  onSubmit: (name: string) => Promise<void>
  initialName?: string
  submitLabel?: string
}

export default function ResourceForm({ 
  onSubmit, 
  initialName = "", 
  submitLabel = "Create Resource" 
}: ResourceFormProps) {
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(name)
    } finally {
      setIsSubmitting(false)
      setName("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Resource Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="Enter resource name"
          required
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  )
}
