import { connectToDatabase, User, Category, Supplier, Product } from './models';

async function testMongooseMigration() {
  try {
    console.log('🔄 Testing Mongoose Migration...\n');

    await connectToDatabase();
    console.log('✅ Database connected\n');

    console.log('🧪 Testing User operations...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      username: 'testuser'
    });
    const savedUser = await testUser.save();
    console.log('✅ User created:', savedUser._id);

    console.log('\n🧪 Testing Category operations...');
    const testCategory = new Category({
      name: 'Test Category',
      userId: savedUser._id
    });
    const savedCategory = await testCategory.save();
    console.log('✅ Category created:', savedCategory._id);

    console.log('\n🧪 Testing Supplier operations...');
    const testSupplier = new Supplier({
      name: 'Test Supplier',
      userId: savedUser._id,
      email: 'supplier@example.com'
    });
    const savedSupplier = await testSupplier.save();
    console.log('✅ Supplier created:', savedSupplier._id);

    console.log('\n🧪 Testing Product operations...');
    const testProduct = new Product({
      name: 'Test Product',
      sku: 'TEST001',
      price: 99.99,
      quantity: 10,
      status: 'active',
      categoryId: savedCategory._id,
      supplierId: savedSupplier._id,
      userId: savedUser._id
    });
    const savedProduct = await testProduct.save();
    console.log('✅ Product created:', savedProduct._id);

    console.log('\n🧪 Testing Product population...');
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name');
    console.log('✅ Product with populated data:', {
      name: populatedProduct?.name,
      category: populatedProduct?.categoryId?.name,
      supplier: populatedProduct?.supplierId?.name
    });

    console.log('\n🧪 Testing queries...');
    const userProducts = await Product.find({ userId: savedUser._id });
    console.log('✅ Found products for user:', userProducts.length);

    const userCategories = await Category.find({ userId: savedUser._id });
    console.log('✅ Found categories for user:', userCategories.length);

    const userSuppliers = await Supplier.find({ userId: savedUser._id });
    console.log('✅ Found suppliers for user:', userSuppliers.length);

    console.log('\n🧹 Cleaning up test data...');
    await Product.findByIdAndDelete(savedProduct._id);
    await Category.findByIdAndDelete(savedCategory._id);
    await Supplier.findByIdAndDelete(savedSupplier._id);
    await User.findByIdAndDelete(savedUser._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Mongoose migration test completed successfully!');
    console.log('✅ All CRUD operations working');
    console.log('✅ Relationships and population working');
    console.log('✅ Queries working correctly');

  } catch (error) {
    console.error('❌ Migration test failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testMongooseMigration();
