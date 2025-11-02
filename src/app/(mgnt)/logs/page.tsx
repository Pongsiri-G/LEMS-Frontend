"use client"

import { useState, useEffect, useMemo } from 'react'
import { Log } from '@/src/types/log'
import LogTable from '@/src/components/logs/LogTable'
import { getLogs, LogQueryParams } from '@/src/services/logService/queryService'

const LogsPage = () => {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<string>('all')

    const params: LogQueryParams = useMemo(
        () => ({
            logType: filterType,
            q: searchTerm.trim() || undefined,
            sort: 'created_at desc',
        }),
        [searchTerm, filterType]
    )

    async function load() {
        setLoading(true)
        try {
            const data = await getLogs(params)
            setLogs(data)
        } catch (e) {
            alert('โหลดข้อมูลล้มเหลว')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // Load when filterType changes
    useEffect(() => {
        load()
    }, [filterType])
    // Load on mount
    useEffect(() => {
        load()
    }, [])

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
                    onClick={load}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Refresh
                </button>
                <span className="text-sm text-gray-600">
                    Showing {filteredLogs.length} of {logs.length} logs
                </span>
            </div>

            <LogTable logs={filteredLogs} />
        </>
    )
}

export default LogsPage