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

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">System Logs</h1>
                <p className="text-sm md:text-base text-gray-600 mt-2">View all system activities and events</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Search by user, message, or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter by type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            {uniqueLogTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {filteredLogs.length} of {logs.length} logs
                    </p>
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading logs...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {/* Logs Table */}
            {!loading && !error && (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                        <div className="overflow-x-auto overflow-y-auto flex-1">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Create Time
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            User
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Type
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                            Message
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No logs found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLogs.map((log) => (
                                            <tr key={log.logID} className="hover:bg-gray-50">
                                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                                                    {log.createAt}
                                                </td>
                                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                                    <div className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-[150px] lg:max-w-none">
                                                        {log.userName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[150px] lg:max-w-none">
                                                        {log.userID}
                                                    </div>
                                                </td>
                                                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogTypeColor(log.logType)}`}>
                                                        {log.logType}
                                                    </span>
                                                </td>
                                                <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">
                                                    {log.message || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                        {filteredLogs.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                                No logs found
                            </div>
                        ) : (
                            filteredLogs.map((log) => (
                                <div key={log.logID} className="bg-white rounded-lg shadow-md p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLogTypeColor(log.logType)}`}>
                                            {log.logType}
                                        </span>
                                        <span className="text-xs text-gray-500">{log.createAt}</span>
                                    </div>
                                    <div className="mb-2">
                                        <div className="text-sm font-medium text-gray-900 mb-1">
                                            {log.userName}
                                        </div>
                                        <div className="text-xs text-gray-500 break-all">
                                            {log.userID}
                                        </div>
                                    </div>
                                    {log.message && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="text-xs text-gray-600">Message:</div>
                                            <div className="text-sm text-gray-900 mt-1 break-words">
                                                {log.message}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default LogsPage