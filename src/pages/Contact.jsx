import React from 'react'

export default function Contact() {
    const [form, setForm] = React.useState({ name: '', email: '', message: '' })
    const [submitted, setSubmitted] = React.useState(false)

    const colors = {
        lime: '#8BC34A',        // Fresh Lime Green
        forest: '#2E7D32',      // Deep Forest Green
        aqua: '#00BCD4',        // Teal/Aqua Accent
        white: '#FFFFFF'        // Clean White
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSubmit(e) {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="space-y-3" style={{ backgroundColor: colors.white }}>
            <h1 className="text-xl font-semibold" style={{ color: colors.forest }}>Contact</h1>

            <div className="card p-4 mb-4" style={{ borderLeft: `4px solid ${colors.aqua}`, backgroundColor: '#F9F9F9' }}>
                <div>Email: support@placemint.com</div>
                <div>Phone: +91 12345 67890</div>
            </div>

            <div className="card p-4" style={{ border: `1px solid ${colors.forest}30`, borderRadius: '8px' }}>
                <h2 className="font-semibold mb-2" style={{ color: colors.forest }}>Enquiry Form</h2>

                {submitted ? (
                    <div style={{ color: colors.lime, fontWeight: '600' }}>Thank you for your enquiry!</div>
                ) : (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <input
                            className="rounded p-2 w-full"
                            style={{ border: `1px solid ${colors.forest}80`, backgroundColor: colors.white }}
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="rounded p-2 w-full"
                            style={{ border: `1px solid ${colors.forest}80`, backgroundColor: colors.white }}
                            name="email"
                            type="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            className="rounded p-2 w-full"
                            style={{ border: `1px solid ${colors.forest}80`, backgroundColor: colors.white }}
                            name="message"
                            placeholder="Your Message"
                            value={form.message}
                            onChange={handleChange}
                            rows={4}
                            required
                        />

                        <button
                            className="btn drop-shadow-lg"
                            type="submit"
                            style={{ backgroundColor: colors.lime, color: colors.white, border: `2px solid ${colors.forest}` }}
                        >
                            Send Enquiry
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
