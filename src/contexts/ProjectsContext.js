import projects from '../projects/build_index.json'
import { createContext } from 'react'

const ProjectsContext = createContext({
    projects,
})

export const { Consumer, Provider, displayName } = ProjectsContext

export default ProjectsContext