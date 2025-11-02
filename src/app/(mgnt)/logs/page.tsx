"use client"

import React, { useEffect, useState } from 'react'
import { apiClient } from '@/src/services/apiClient'
import { Log, toLog } from '@/src/types/log'

const LogsPage = () => {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<string>('all')

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await apiClient.get('v1/admin/logs')
            const logsData = response.data.map((item: any) => toLog(item))
            setLogs(logsData)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch logs')
            console.error('Error fetching logs:', err)
        } finally {
            setLoading(false)
        }
    }

    const getLogTypeColor = (logType: string) => {
        switch (logType.toLowerCase()) {
            case 'login':
                return 'bg-purple-100 text-purple-800'
            case 'register':
                return 'bg-green-100 text-green-800'
            case 'accept':
                return 'bg-emerald-100 text-emerald-800'
            case 'reject':
                return 'bg-red-100 text-red-800'
            case 'activate':
                return 'bg-blue-100 text-blue-800'
            case 'deactivate':
                return 'bg-orange-100 text-orange-800'
            case 'delete':
                return 'bg-red-200 text-red-900'
            case 'grant_admin':
                return 'bg-indigo-100 text-indigo-800'
            case 'revoke_admin':
                return 'bg-pink-100 text-pink-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.logType.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesFilter = filterType === 'all' || log.logType.toLowerCase() === filterType.toLowerCase()
        
        return matchesSearch && matchesFilter
    })

    const uniqueLogTypes = Array.from(new Set(logs.map(log => log.logType)))

    if (loading) return <p className="text-center mt-10">Loading...</p>

    return (
        <>
            <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl font-semibold">System Logs</h1>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by user, message, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-3 py-2 w-64"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="all">All Types</option>
                    {uniqueLogTypes.map(type => (
                        <option key={type} value={type}>
                            {type.toUpperCase()}
                        </option>
                    ))}
                </select>
                <button
                    onClick={fetchLogs}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Refresh
                </button>
                <span className="text-sm text-gray-600">
                    Showing {filteredLogs.length} of {logs.length} logs
                </span>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Logs Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-[calc(80vh-200px)] overflow-auto">
                    <table className="w-full">
                        <thead className="bg-blue-100 sticky top-0 z-10">
                            <tr className="text-left">
                                <th className="p-3">Create Time</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-5 text-center text-gray-500">
                                        No logs found
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.logID} className="border-t hover:bg-blue-50 transition-colors">
                                        <td className="p-3">
                                            {log.createAt}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-medium">
                                                {log.userName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {log.userID}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogTypeColor(log.logType)}`}>
                                                {log.logType}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {log.message || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default LogsPage