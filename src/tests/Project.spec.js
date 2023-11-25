import { describe, expect, it } from 'vitest'
import { useRepo } from 'pinia-orm'
import { Project } from '@/stores/Project.js'
//import { PersonProjectStatus } from '@/stores/PersonProjectStatus';

import data from '@/tests/data/projects.json'


describe('Project', () => {
  const dataProjects = data 
  const useProject = useRepo(Project)
  //const usePersonProject = useRepo(PersonProjectStatus)


  for(const project of dataProjects){
    useProject.save({
      Name: project.Name,
      Status: project.Status,
      Category: project.Category,
      StartDate: project.Startdate,
      EndDate: project.Enddate,
      LifecycleId: "TJBQwoU9w3tOmYmEF_7cy",
      Repos: project.Repos
    })
  }
  
    it('ignores unkown field when filling the model', () => {



  
      expect(useProject.get).toBe(2)
      //expect((user as any).name).toBe(undefined)
    })
})