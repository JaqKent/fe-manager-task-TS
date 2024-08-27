import { useEffect, useState } from 'react';
import { Carousel, Col, Container, Row } from 'react-bootstrap';
import { Notes } from 'Interfaces/Notes';

import { useAuthContext } from '~contexts/auth/AuthContext';
import { useNoteContext } from '~contexts/Notes/Notes';

import ButtonNotes from '../ButtonNotes/ButtonNotes';
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import Note from '../Note/Note';
import Searchbar from '../Searchbar/Searchbar';

import './Dashboard.css';

interface DashboardProps {
  notes: Notes[];
  getNotes: () => void;
  addNote: (noteData: {
    title: string;
    description: string;
    userId: string;
  }) => void;
  loading: boolean;
}

function Dashboard() {
  // Context
  const { notes, getNotes, addNote, loading, updateCoordinates } =
    useNoteContext();
  const { user } = useAuthContext();

  // State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filteredNotes, setFilteredNotes] = useState<Notes[]>([]);

  // Filter notes based on status
  const filterByStatus = () => {
    if (filterStatus === 'all') {
      setFilteredNotes(notes);
    } else if (filterStatus === 'active') {
      const results = notes.filter((note) => note.active === true);
      setFilteredNotes(results);
    } else if (filterStatus === 'completed') {
      const results = notes.filter((note) => note.active === false);
      setFilteredNotes(results);
    }
  };

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filterByStatus();
    // eslint-disable-next-line
  }, [notes, filterStatus]);

  const handleSearchbar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.length > 3) {
      const results = notes.filter(
        (note) =>
          note.description.toLowerCase().includes(searchValue.toLowerCase()) ||
          note.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNotes(results);
    } else {
      filterByStatus(); // Apply filter status to the search results
    }
  };

  const handleAddNote = () => {
    if (user && user._id) {
      const userId = user._id;

      const newNote = {
        title: 'New Note',
        description: 'Note description',
        userId,
      };

      addNote(newNote);
    } else {
      console.error('User ID is required');
    }
  };

  return (
    <Container>
      <Row className='justify-content-between my-2'>
        <Col xs={12} sm={4} md={4} lg={4}>
          <ButtonNotes
            loading={loading}
            addNote={handleAddNote}
            filter={setFilterStatus}
            filterValue={filterStatus}
          />
        </Col>
        <Col xs={12} sm={4} md={4} lg={4}>
          <FilterDropdown
            options={['all', 'active', 'completed']}
            value={filterStatus}
            handleSelect={setFilterStatus}
          />
        </Col>
        <Col xs={12} sm={4} md={4} lg={4}>
          <Searchbar searchTerm={searchTerm} handleChange={handleSearchbar} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Carousel interval={null} indicators={false} touch={false}>
            <Carousel.Item>
              <div className='fondo-color-cork'>
                {filteredNotes.map((note) => (
                  <Note
                    key={note._id}
                    noteList={filteredNotes}
                    handleList={setFilteredNotes}
                    note={note}
                    updateCoordinates={updateCoordinates}
                  />
                ))}
              </div>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
