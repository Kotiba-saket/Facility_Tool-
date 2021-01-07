package com.Faciltiy_Tool.facilitytoos.Controller;

import com.Faciltiy_Tool.facilitytoos.Repository.CategoryRepository;
import com.Faciltiy_Tool.facilitytoos.model.Category;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
/**
 * This class contains all API calls to the category collection
 */
@RestController
@RequestMapping(path = "/api")
public class CategoryController
{
    private final CategoryRepository repository;
    @Autowired
    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    /**
     * This method communicates directly with the mongodb database to add a new category to an existing department
     * @param id the id of the category
     * @param body the json object body of the category from the client side
     * @return list of categories if the call is successful
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PostMapping("/category/{id}")
    public Set<String> addCategory(@PathVariable String id, @RequestBody String body)
    {
        Set<String> emptyList = null;
        Optional<Category> optCategory = repository.findById(id);
        Category category;

        if (optCategory.isPresent())
        {
            category = optCategory.get();

            try
            {
                JSONObject obj = new JSONObject(body);
                String newCategory = obj.getString("category");

                category.getCategories().add(newCategory);
                repository.save(category);

                return category.getCategories();
            }
            catch (JSONException ex)
            {
                return emptyList;
            }
        }

        return emptyList;
    }

    /**
     * This method communicates directly with the mongodb database to delete an existing category from a department
     * @param id the id of the category to be deleted
     * @param body JSON object body of the category to be deleted
     * @return list of categories if the call is successful
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @DeleteMapping("/category/{id}")
    public Set<String> deleteCategory(@PathVariable String id, @RequestBody String body)
    {
        Set<String> emptyList = null;
        Optional<Category> optCategory = repository.findById(id);
        Category category;

        if (optCategory.isPresent())
        {
            category = optCategory.get();

            try
            {
                JSONObject obj = new JSONObject(body);
                String newCategory = obj.getString("category");

                category.getCategories().remove(newCategory);
                repository.save(category);

                return category.getCategories();
            }
            catch (JSONException ex)
            {
                return emptyList;
            }
        }

        return emptyList;
    }

    /**
     * This method communicates directly with the mongodb database to add a new department
     * @param department the department body object from the client side
     * @return department
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @PostMapping("/department/{department}")
    public Category addDepartment(@PathVariable String department)
    {
        ArrayList<Category> categories = repository.findByDepartment(department);

        if (categories.isEmpty())
        {
            Category category = new Category("", department, new TreeSet<String>());
            repository.save(category);

            return category;
        }

        return null;
    }

    /**
     * This method communicates directly with the mongodb database to delete an existing department
     * @param id the id of the department
     * @return null
     */
    @PreAuthorize("hasAuthority('Role_Admin')")
    @DeleteMapping("/department/{id}")
    public Category deleteDepartment(@PathVariable String id)
    {
        Optional<Category> optCategory = repository.findById(id);
        Category category;

        if (optCategory.isPresent())
        {
            category = optCategory.get();

            repository.delete(category);

            return category;
        }

        return null;
    }

    /**
     * This method communicates directly with the mongodb database to fetch list of all categories
     * @return a list of categories
     */
    @GetMapping("/category")
    public List<Category> getAllCategory() {
        List<Category> categories;

        categories = repository.findAll();
        return categories;
    }

    /**
     * This method communicates directly with the mongodb database to fetch list of all departments
     * @param department this is the department the category is fetched from
     * @return list of departments
     */
    @GetMapping("/category/{department}")
    public List<Category> getByDepartment(@PathVariable String department) {
        List<Category> categories;

        categories = repository.findByDepartment(department);
        return categories;
    }
}
