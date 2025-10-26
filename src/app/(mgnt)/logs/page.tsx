"use client"

import React from 'react'

const LogsPage = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">System Logs</h1>
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600">No logs to display</p>
            </div>
        </div>
    )
}

export default LogsPage