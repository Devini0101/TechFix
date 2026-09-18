import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../../core/services/category.service';
    
    @Component({
      selector: 'app-categories',
      standalone: true,
      imports: [CommonModule, FormsModule],
      templateUrl: './categories.html',
      styleUrl: './categories.css',
    })
    export class Categories implements OnInit {
      private catService = inject(CategoryService);
    
      // dados iniciais exigidos pela ufpr para testes
      categories = signal<Category[]>([
        { id: 1, name: 'Notebook', code: 'NOTE-01', active: true },
        { id: 2, name: 'Desktop', code: 'DSK-02', active: true },
        { id: 3, name: 'Impressora', code: 'IMP-03', active: true },
        { id: 4, name: 'Mouse', code: 'MOU-04', active: true },
        { id: 5, name: 'Teclado', code: 'TEC-05', active: false }
      ]);
    
      // controle do modal de criacao e edicao
      isModalOpen = signal(false);
      isEditing = signal(false);
    
      // categoria selecionada para o formulario
      currentCategory = signal<Category>({
        id: 0,
        name: '',
        code: '',
        active: true
      });
    
      // contadores automaticos pros cards de resumo
      totalCategories = computed(() => this.categories().length);
      activeCategories = computed(() => this.categories().filter(c => c.
  active).length);
      inactiveCategories = computed(() => this.categories().filter(c => !c.
  active).length);
    
      ngOnInit() {
        this.loadCategories();
      }
    
      // tenta buscar do backend se tiver rodando
      loadCategories() {
        this.catService.getAll().subscribe({
          next: (data) => {
            if (data && data.length > 0) this.categories.set(data);
          },
          error: () => console.log('usando dados mockados')
        });
      }
    
      // abre modal limpo para novo cadastro
      openCreateModal() {
        this.currentCategory.set({
          id: Date.now(),
          name: '',
          code: '',
          active: true
        });
        this.isEditing.set(false);
        this.isModalOpen.set(true);
      }
    
      // abre modal preenchido para editar
      openEditModal(cat: Category) {
        this.currentCategory.set({ ...cat });
        this.isEditing.set(true);
        this.isModalOpen.set(true);
      }
    
      closeModal() {
        this.isModalOpen.set(false);
      }
    
      // salva a nova categoria ou a alteracao
      saveCategory() {
        const item = this.currentCategory();
        if (!item.name || !item.code) {
          alert('Preencha o nome e o código da categoria.');
          return;
        }
    
        if (this.isEditing()) {
          this.categories.update(list =>
            list.map(c => c.id === item.id ? item : c)
          );
        } else {
          this.categories.update(list => [...list, item]);
        }
    
        this.closeModal();
      }
    
      // desativa ou reativa a categoria
      toggleStatus(cat: Category) {
        const msg = cat.active ? 'desativar' : 'ativar';
        if (confirm(`Deseja ${msg} a categoria "${cat.name}"?`)) {
          this.categories.update(list =>
            list.map(c => c.id === cat.id ? { ...c, active: !c.active } : c)
          );
        }
      }
    }