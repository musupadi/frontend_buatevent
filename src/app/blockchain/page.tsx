'use client'

import {
  useEffect,
  useState,
} from 'react';
import { API_ENDPOINTS } from '@/lib/api';

import {
  FiActivity,
  FiBox,
  FiClock,
  FiDatabase,
  FiHash,
  FiLayers,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

interface BlockchainStats {
  total_blocks: number
  total_reservations: number
  blockchain_type: string
  status: string
  last_block_time?: string
}

interface Block {
  index: number
  timestamp: string
  data: any
  previous_hash: string
  hash: string
  nonce: number
}

export default function BlockchainPage() {
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'stats' | 'blocks'>('stats')

  useEffect(() => {
    fetchBlockchainData()
  }, [])

  const fetchBlockchainData = async () => {
    try {
      const [statsRes, blocksRes] = await Promise.all([
        fetch(API_ENDPOINTS.BLOCKCHAIN_STATS),
        fetch(API_ENDPOINTS.BLOCKCHAIN_BLOCKS)
      ])

      const statsData = await statsRes.json()
      const blocksData = await blocksRes.json()

      setStats(statsData)
      setBlocks(blocksData.blocks || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching blockchain data:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blockchain Tracking</h1>
            <p className="text-xl text-white/90">
              View immutable reservation records powered by Hyperledger Fabric
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'stats'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiActivity className="inline mr-2" />
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'blocks'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiBox className="inline mr-2" />
              Blocks
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading blockchain data...</p>
            </div>
          ) : (
            <>
              {/* Statistics Tab */}
              {activeTab === 'stats' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FiBox className="text-blue-600" size={32} />
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        stats.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {stats.status}
                      </span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-2">Total Blocks</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_blocks}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FiDatabase className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-2">Total Reservations</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.total_reservations}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FiLayers className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-2">Blockchain Type</h3>
                    <p className="text-xl font-bold text-gray-900 capitalize">{stats.blockchain_type}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FiClock className="text-orange-600" size={32} />
                    </div>
                    <h3 className="text-gray-600 text-sm mb-2">Last Block</h3>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.last_block_time ? new Date(stats.last_block_time).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {/* Blocks Tab */}
              {activeTab === 'blocks' && (
                <div className="space-y-4">
                  {blocks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <FiBox size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg">No blocks found</p>
                    </div>
                  ) : (
                    blocks.map((block, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div>
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                                #{block.index}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">Block {block.index}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(block.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <FiHash size={16} className="mr-2" />
                                  <span className="text-sm font-semibold">Block Hash</span>
                                </div>
                                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                                  {block.hash}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <FiHash size={16} className="mr-2" />
                                  <span className="text-sm font-semibold">Previous Hash</span>
                                </div>
                                <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                                  {block.previous_hash}
                                </p>
                              </div>

                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <span className="text-sm font-semibold">Nonce: {block.nonce}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Block Data */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Block Data</h4>
                            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">
                                {JSON.stringify(block.data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
