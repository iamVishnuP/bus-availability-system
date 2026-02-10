import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBuses } from '../../services/api';
import Navbar from '../Navbar/Navbar';
import './UserDashboard.css';

const UserDashboard = () => {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const response = await searchBuses(source, destination);
            setBuses(response.data);
        } catch (error) {
            console.error('Error searching buses:', error);
            alert('Error searching buses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateFare = (bus, from, to) => {
        // Normalize helper
        const norm = (str) => str ? str.trim().toLowerCase() : '';

        // Helper to get price for a specific location
        const getPriceForLocation = (location) => {
            const locNorm = norm(location);
            if (locNorm === norm(bus.source)) return 0;
            if (locNorm === norm(bus.destination)) return parseInt(bus.price || 0, 10);

            const stop = bus.stops.find(s => norm(s.name) === locNorm);
            return stop ? parseInt(stop.ticketPrice || 0, 10) : 0;
        };

        const fromPrice = getPriceForLocation(from);
        const toPrice = getPriceForLocation(to);

        // Price is absolute difference between the two points
        const price = Math.abs(toPrice - fromPrice);
        return isNaN(price) ? 0 : price;
    };

    // Check if bus has passed the user's source location
    const checkIfBusPassed = (bus, sourceLocation) => {
        const norm = (str) => str ? str.trim().toLowerCase() : '';
        const userSource = norm(sourceLocation);

        // Find time at source location
        let sourceTimeStr = '';
        if (userSource === norm(bus.source)) {
            sourceTimeStr = bus.sourceTime;
        } else {
            const stop = bus.stops.find(s => norm(s.name) === userSource);
            if (stop) sourceTimeStr = stop.time;
        }

        if (!sourceTimeStr) return false;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [h, m] = sourceTimeStr.split(':').map(Number);
        const busMinutes = h * 60 + m;

        return currentMinutes > busMinutes;
    };

    // Find next available bus
    const getNextAvailableBus = (currentBus) => {
        const norm = (str) => str ? str.trim().toLowerCase() : '';

        // Filter buses on the same route that haven't passed yet
        const upcomingBuses = buses.filter(b =>
            b._id !== currentBus._id &&
            norm(b.source) === norm(currentBus.source) &&
            norm(b.destination) === norm(currentBus.destination) &&
            !checkIfBusPassed(b, source)
        );

        if (upcomingBuses.length === 0) return null;

        // Sort by time at source to find the immediate next
        upcomingBuses.sort((a, b) => {
            const getSourceTime = (busObj) => {
                if (norm(source) === norm(busObj.source)) {
                    const [h, m] = busObj.sourceTime.split(':').map(Number);
                    return h * 60 + m;
                }
                const s = busObj.stops.find(st => norm(st.name) === norm(source));
                if (s) {
                    const [h, m] = s.time.split(':').map(Number);
                    return h * 60 + m;
                }
                return 9999;
            };
            return getSourceTime(a) - getSourceTime(b);
        });

        return upcomingBuses[0];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Transit': return '#4caf50';
            case 'At Stop': return '#ff9800';
            case 'Not Started': return '#2196f3';
            case 'Completed': return '#9e9e9e';
            default: return '#666';
        }
    };

    return (
        <div className="user-dashboard">
            {/* Bus Animation Scene */}
            <div className="bus-animation-scene">
                {/* Bus Stop with Signboard */}
                <div className="bus-stop">
                    <div className="bus-stop-signboard">BUS STOP</div>
                    <div className="bus-stop-pole">🚏</div>
                </div>

                {/* People waiting at the stop */}
                <div className="people-at-stop">
                    <span className="waiting-person">🧍</span>
                    <span className="waiting-person">🧍‍♀️</span>
                    <span className="waiting-person">🧍‍♂️</span>
                </div>

                {/* Moving Bus */}
                <div className="moving-bus">🚌</div>
            </div>

            <Navbar username={username} isAdmin={false} />

            <div className="search-container">
                <h2>Find Your Bus</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-inputs">
                        <div className="input-group">
                            <label>📍 From (Source)</label>
                            <input
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                placeholder="Enter source location"
                                required
                            />
                        </div>

                        <div className="arrow">→</div>

                        <div className="input-group">
                            <label>🎯 To (Destination)</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Enter destination"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="search-btn" disabled={loading}>
                        {loading ? 'Searching...' : '🔍 Search Buses'}
                    </button>
                </form>
            </div>

            {searched && (
                <div className="results-container">
                    <h2>
                        {buses.length > 0
                            ? `Found ${buses.length} bus${buses.length > 1 ? 'es' : ''} `
                            : 'No buses found for this route'
                        }
                    </h2>

                    {buses.length > 0 && (
                        <div className="buses-grid">
                            {buses.map((bus) => {
                                const isPassed = checkIfBusPassed(bus, source);
                                const nextBus = isPassed ? getNextAvailableBus(bus) : null;

                                return (
                                    <div key={bus._id} className={`bus-result-card ${isPassed ? 'bus-passed-card' : ''}`}>
                                        <div className="bus-card-header">
                                            <div className="header-left">
                                                <h3>{bus.busName}</h3>
                                                {isPassed && <span className="bus-passed-badge">⚠️ BUS PASSED</span>}
                                            </div>
                                            <div className="bus-badges">
                                                <span className="ticket-price-badge">
                                                    ₹ {calculateFare(bus, source, destination)}
                                                </span>
                                                <span className={`bus-type ${bus.busType.toLowerCase().replace(' ', '-')}`}>
                                                    {bus.busType}
                                                </span>
                                            </div>
                                        </div>

                                        {isPassed && nextBus && (
                                            <div className="next-bus-suggestion">
                                                <p>✅ Next available bus: <strong>{nextBus.busName}</strong> at
                                                    <strong>
                                                        {(() => {
                                                            const norm = (str) => str ? str.trim().toLowerCase() : '';
                                                            if (norm(source) === norm(nextBus.source))
                                                                return ' ' + new Date(`2000-01-01T${nextBus.sourceTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                                                            const stop = nextBus.stops.find(s => norm(s.name) === norm(source));
                                                            return stop ? ' ' + new Date(`2000-01-01T${stop.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
                                                        })()}
                                                    </strong>
                                                </p>
                                            </div>
                                        )}

                                        <div className="bus-route">
                                            <div className="route-point">
                                                <span className="route-icon">🔵</span>
                                                <div>
                                                    <strong>{bus.source}</strong>
                                                    <p>{new Date(`2000-01-01T${bus.sourceTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                                                </div>
                                            </div>
                                            <div className="route-line"></div>
                                            <div className="route-point">
                                                <span className="route-icon">🔴</span>
                                                <div>
                                                    <strong>{bus.destination}</strong>
                                                    <p>{new Date(`2000-01-01T${bus.destinationTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {bus.travelInfo && (
                                            <div className="travel-info">
                                                <div className="info-item">
                                                    <span className="info-label">Arrival at {source}</span>
                                                    <span className="info-value">{bus.travelInfo.arrivalTime}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Travel Time</span>
                                                    <span className="info-value">{bus.travelInfo.formatted}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">Reach {destination}</span>
                                                    <span className="info-value">{bus.travelInfo.reachTime}</span>
                                                </div>
                                            </div>
                                        )}

                                        {bus.currentLocation && (
                                            <div className="location-info">
                                                <div
                                                    className="status-badge"
                                                    style={{ background: getStatusColor(bus.currentLocation.status) }}
                                                >
                                                    {bus.currentLocation.status}
                                                </div>
                                                <div className="location-details">
                                                    <p className="location-text">
                                                        <strong>📍 Current Location:</strong> {bus.currentLocation.location}
                                                    </p>
                                                    {bus.currentLocation.progress && (
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{ width: bus.currentLocation.progress }}
                                                            ></div>
                                                            <span className="progress-text">{bus.currentLocation.progress}</span>
                                                        </div>
                                                    )}
                                                    {bus.currentLocation.nextStop && (
                                                        <p className="next-stop">
                                                            <strong>Next Stop:</strong> {bus.currentLocation.nextStop}
                                                            {bus.currentLocation.estimatedArrival &&
                                                                ` at ${bus.currentLocation.estimatedArrival} `
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {bus.stops.length > 0 && (
                                            <details className="stops-details">
                                                <summary>View All Stops ({bus.stops.length})</summary>
                                                <div className="stops-list">
                                                    {bus.stops.map((stop, index) => (
                                                        <div key={index} className="stop-item">
                                                            <span>{stop.name}</span>
                                                            <span>{stop.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {buses.length === 0 && (
                        <div className="no-results">
                            <p>😔 No buses available for this route</p>
                            <p className="suggestion">Try searching for a different route or check back later</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
