'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  room_type_name: string;
  floor: number;
  status: string;
  layout_x: number | null;
  layout_y: number | null;
  layout_width: number;
  layout_height: number;
  is_blockchain_enabled: boolean;
}

interface RoomType {
  id: number;
  type_name: string;
}

interface DraggedRoom {
  room: Room;
  offsetX: number;
  offsetY: number;
}

export default function RoomLayoutEditor() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [floors, setFloors] = useState<number[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedRoom, setDraggedRoom] = useState<DraggedRoom | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Grid settings
  const [gridSize, setGridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userStr);
    if (!['hotel_super_admin', 'hotel_admin'].includes(parsedUser.role)) {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setHotelId(parsedUser.hotel_id);
    fetchRoomTypes(parsedUser.hotel_id);
    fetchFloors(parsedUser.hotel_id);
  }, [router]);

  useEffect(() => {
    if (hotelId && selectedFloor) {
      fetchRooms();
    }
  }, [hotelId, selectedFloor, selectedRoomType]);

  const fetchFloors = async (hotelId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      console.log('Floors API response:', data);
      
      // Extract unique floors
      const uniqueFloors = Array.from(new Set(data.rooms.map((r: any) => r.floor))).sort((a: any, b: any) => a - b);
      setFloors(uniqueFloors as number[]);
      if (uniqueFloors.length > 0) {
        setSelectedFloor(uniqueFloors[0] as number);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const fetchRoomTypes = async (hotelId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/room-types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Room types:', data);
      setRoomTypes(data.roomTypes || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };



  const fetchRooms = async () => {
    if (!hotelId || !selectedFloor) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:8080/api/v1/hotels/${hotelId}/layout/${selectedFloor}`;
      if (selectedRoomType) {
        url += `?room_type_id=${selectedRoomType}`;
      }
      
      console.log('Fetching rooms from:', url);
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Rooms data:', data);
      setRooms(data.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, room: Room) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const displayX = room.layout_x !== null ? room.layout_x : 0;
    const displayY = room.layout_y !== null ? room.layout_y : 0;
    const offsetX = e.clientX - rect.left - displayX;
    const offsetY = e.clientY - rect.top - displayY;
    
    setDraggedRoom({ room, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedRoom || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - draggedRoom.offsetX;
    let y = e.clientY - rect.top - draggedRoom.offsetY;
    
    // Snap to grid
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }
    
    // Use proper room dimensions
    const roomWidth = draggedRoom.room.layout_width > 10 ? draggedRoom.room.layout_width : 100;
    const roomHeight = draggedRoom.room.layout_height > 10 ? draggedRoom.room.layout_height : 70;
    
    // Keep within bounds
    x = Math.max(0, Math.min(x, rect.width - roomWidth));
    y = Math.max(0, Math.min(y, rect.height - roomHeight));
    
    setRooms(prev => prev.map(r => 
      r.id === draggedRoom.room.id 
        ? { ...r, layout_x: x, layout_y: y, layout_width: roomWidth, layout_height: roomHeight }
        : r
    ));
    setHasChanges(true);
  };

  const handleMouseUp = () => {
    setDraggedRoom(null);
  };

  const saveLayout = async () => {
    if (!hotelId) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updates = rooms.map(room => ({
        room_id: room.id,
        layout_x: room.layout_x,
        layout_y: room.layout_y,
        layout_width: room.layout_width,
        layout_height: room.layout_height
      }));

      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/layout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        alert('Layout saved successfully!');
        setHasChanges(false);
      } else {
        throw new Error('Failed to save layout');
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  const autoArrange = async () => {
    if (!hotelId || !selectedFloor) {
      alert('⚠️ Hotel ID atau Floor belum dipilih!');
      return;
    }
    
    if (rooms.length === 0) {
      alert('⚠️ Tidak ada room untuk diatur!');
      return;
    }
    
    // Cinema-style layout: arrange in rows like theater seats
    const columnsInput = prompt('Berapa kolom per baris? (seperti bioskop, misal: 8-10)', '8');
    if (!columnsInput) return; // User cancelled
    
    const columns = parseInt(columnsInput) || 8;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('⚠️ Token tidak ditemukan. Silakan login ulang.');
        setSaving(false);
        return;
      }
      
      // Arrange locally first for immediate feedback
      const roomWidth = 100;  // Fixed width per room
      const roomHeight = 70;  // Fixed height per room
      const spacingX = 15;    // Horizontal spacing between rooms
      const spacingY = 20;    // Vertical spacing between rows
      const startX = 50;      // Left margin
      const startY = 50;      // Top margin
      
      const arrangedRooms = rooms.map((room, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        return {
          room_id: room.id,
          layout_x: startX + (col * (roomWidth + spacingX)),
          layout_y: startY + (row * (roomHeight + spacingY)),
          layout_width: roomWidth,
          layout_height: roomHeight
        };
      });
      
      console.log('Sending auto-arrange request:', {
        hotelId,
        roomCount: arrangedRooms.length,
        columns,
        arrangedRooms
      });
      
      // Update backend
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/layout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ updates: arrangedRooms })
      });

      console.log('Auto-arrange response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Auto-arrange result:', result);
        alert(`✅ Layout diatur seperti bioskop!\n${result.updated_count} rooms berhasil diatur dalam ${columns} kolom.`);
        await fetchRooms();
        setHasChanges(false);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Auto-arrange failed:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to auto-arrange`);
      }
    } catch (error: any) {
      console.error('Error auto-arranging:', error);
      alert(`❌ Gagal mengatur layout:\n${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  const resetLayout = async () => {
    if (!confirm('Are you sure you want to reset all room positions?')) return;
    if (!hotelId) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/layout/reset`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Layout reset successfully!');
        await fetchRooms();
        setHasChanges(false);
      } else {
        throw new Error('Failed to reset layout');
      }
    } catch (error) {
      console.error('Error resetting layout:', error);
      alert('Failed to reset layout');
    } finally {
      setSaving(false);
    }
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'OCCUPIED': return 'bg-red-500';
      case 'MAINTENANCE': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Room Layout Editor</h1>
              <p className="text-gray-600 mt-1">Drag and drop rooms to arrange floor plan</p>
            </div>
            <button
              onClick={() => router.push('/hotel-admin')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Floor Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {floors.map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
                ))}
              </select>
            </div>

            {/* Room Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <select
                value={selectedRoomType || ''}
                onChange={(e) => setSelectedRoomType(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                {roomTypes.map(rt => (
                  <option key={rt.id} value={rt.id}>{rt.type_name}</option>
                ))}
              </select>
            </div>

            {/* Grid Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grid Size</label>
              <input
                type="number"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                min="5"
                max="50"
              />
            </div>

            {/* Grid Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Show Grid</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Snap to Grid</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={saveLayout}
              disabled={!hasChanges || saving}
              className={`px-6 py-2 rounded-lg font-semibold ${
                hasChanges && !saving
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Save Layout'}
            </button>
            <button
              onClick={autoArrange}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
            >
              Auto Arrange
            </button>
            <button
              onClick={resetLayout}
              disabled={saving}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300"
            >
              Reset All
            </button>
            <button
              onClick={fetchRooms}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Floor {selectedFloor} - {rooms.length} rooms
            </h2>
            {hasChanges && (
              <span className="text-orange-600 font-medium">● Unsaved changes</span>
            )}
          </div>

          <div
            ref={canvasRef}
            className={`relative border-2 border-gray-300 rounded-lg overflow-hidden ${
              showGrid ? 'bg-grid' : 'bg-gray-50'
            }`}
            style={{
              minHeight: '600px',
              backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'none',
              backgroundImage: showGrid
                ? 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)'
                : 'none'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {rooms.map(room => {
              // Use fixed size for display, or database values if already positioned
              const displayWidth = (room.layout_x !== null && room.layout_width > 10) ? room.layout_width : 100;
              const displayHeight = (room.layout_y !== null && room.layout_height > 10) ? room.layout_height : 70;
              const displayX = room.layout_x !== null ? room.layout_x : 0;
              const displayY = room.layout_y !== null ? room.layout_y : 0;
              
              return (
                <div
                  key={room.id}
                  className={`absolute cursor-move rounded-lg shadow-lg border-2 border-white flex flex-col items-center justify-center text-white font-semibold hover:shadow-xl transition-shadow ${getRoomColor(room.status)}`}
                  style={{
                    left: displayX,
                    top: displayY,
                    width: displayWidth,
                    height: displayHeight,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, room)}
                  title={`${room.room_number} - ${room.room_type_name} - ${room.status}`}
                >
                  <div className="text-center px-2">
                    <div className="text-sm font-bold">{room.room_number}</div>
                    <div className="text-xs opacity-90 truncate" style={{ maxWidth: '90px' }}>
                      {room.room_type_name.length > 12 ? room.room_type_name.substring(0, 12) + '...' : room.room_type_name}
                    </div>
                    {room.is_blockchain_enabled && (
                      <div className="text-xs mt-1">🔗</div>
                    )}
                  </div>
                </div>
              );
            })}

            {rooms.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-xl font-semibold">No rooms found</p>
                  <p className="text-sm mt-2">Try selecting a different floor or room type</p>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔗</span>
              <span>Blockchain Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
