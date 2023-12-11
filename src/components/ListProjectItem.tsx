import { useLocation, useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { setIsDragging } from '../modules/actions/dragging';
import { reorder } from '../utils/utils';
import { ProjectItem } from './ProjectItem/ProjectItem';
import { Project } from '../modules/types/mainProjects';
import { useFilter } from '../hooks/useFilter';
import { FilterFunction } from '../modules/types/filter';
import { Toolbar } from './Toolbar/Toolbar';
import { FilterModal } from './Modals/FilterModal';
import { filterNames } from '../config/contsants';
import AddIcon from '@mui/icons-material/Add';
import { Button } from './FormElement/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from './UIElements/LoadingSpinner';

interface Props {
  projects: Project[];
  onClick: (id: string) => void;
  updateOrder: (newItem: Project[], oldIndex: string, newIndex: string) => void;
  isWrapped?: boolean;
  isSearched?: boolean;
  handleCreateProject?: () => void;
  hasMore?: boolean;
  handleLoadMoreProjects?: () => void;
}

interface IProjectToFilter {
  name?: string;
  timestamp: string;
  _id: string;
}

const ProjectsFilterFunction: FilterFunction<IProjectToFilter> = (
  item,
  value,
) =>
  item.name ? item.name.toLowerCase().includes(value.toLowerCase()) : false;

export const ListProjectItem: React.FC<Props> = ({
  projects,
  onClick,
  updateOrder,
  isSearched = true,
  handleCreateProject,
  hasMore,
  handleLoadMoreProjects,
}) => {
  const dispatch = useDispatch();
  const projectsToFilter = projects
    ? projects.map((project) => ({
        ...project,
        name: project.projectName,
        timestamp: project.timestamp
          ? project.timestamp
          : new Date().toISOString(),
        _id: project._id,
      }))
    : [];
  const {
    searchedItems,
    selectedSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    isDraggable,
    filterValue,
  } = useFilter({
    items: projectsToFilter,
    filterFunction: ProjectsFilterFunction,
    itemsName: filterNames.projects,
    isProject: true,
  });
  const modalId = 'filter-projects-modal';
  const { pid } = useParams();
  const location = useLocation();
  const isHomePage = location.pathname === '/projects';

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      projects,
      result.source.index,
      result.destination.index,
    );

    updateOrder(newItems, result.source.index, result.destination.index);
    dispatch(setIsDragging(false));
  };

  const handleFilterProjects = (
    e: { preventDefault: () => void },
    projectId: string,
  ) => {
    e.preventDefault();

    // handleFilterByProjectId(projectId);
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilterProjects}
        modalId={modalId}
        label={'Виберіть фільтр для проектів'}
        itemsName={filterNames.projects}
      />
      <div
        style={{
          backgroundColor: 'rgba(248, 248, 248, .8)',
          padding: '5px',
          borderRadius: '5px',
          margin: `${isHomePage ? '0 10px ' : 0}`,
        }}
      >
        {isSearched && !pid && (
          <Toolbar
            modalId={modalId}
            selectedSortOption={selectedSortOption}
            handleSearching={handleSearching}
            onSortByAddingDate={handleSortByAddingDate}
            onSortByDeadline={handleSortByDeadline}
            onSortByLastCommentDate={handleSortbyLastCommentDate}
            onSortDefaultState={handleSortByDefault}
            filterValue={filterValue}
          >
            <Button transparent icon onClick={handleCreateProject}>
              <AddIcon />
            </Button>
          </Toolbar>
        )}
        {isDraggable ? (
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragStart={() => dispatch(setIsDragging(true))}
          >
            <Droppable droppableId='droppable'>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <InfiniteScroll
                    dataLength={projects ? projects.length : 0}
                    next={
                      handleLoadMoreProjects ? handleLoadMoreProjects : () => {}
                    }
                    hasMore={hasMore ?? false} // Replace with a condition based on your data source
                    loader={
                      <div className='loading'>
                        <LoadingSpinner blue />
                      </div>
                    }
                  >
                    {projects &&
                      projects.map((item: Project, index: number) => {
                        return (
                          <ProjectItem
                            key={item._id}
                            projectId={item._id}
                            name={item.projectName ? item.projectName : ''}
                            logo={item.logoUrl}
                            description={item.description}
                            index={index}
                            onClick={onClick}
                            sharedWith={item.sharedWith}
                            id={item._id}
                            project={item}
                            isDraggable={isDraggable}
                          />
                        );
                      })}
                  </InfiniteScroll>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <>
            {searchedItems &&
              searchedItems.map((item: Project, index: number) => {
                return (
                  <ProjectItem
                    key={item._id}
                    projectId={item._id}
                    name={item.projectName ? item.projectName : ''}
                    logo={item.logoUrl}
                    description={item.description}
                    index={index}
                    onClick={onClick}
                    sharedWith={item.sharedWith}
                    id={item._id}
                    project={item}
                  />
                );
              })}
          </>
        )}
      </div>
    </>
  );
};
