"use client";

import { Log } from "@/src/types/log";

interface Props {
  logs: Log[];
}

export default function LogTable({ logs }: Props) {
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

  return (
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
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-5 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
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
  );
}
